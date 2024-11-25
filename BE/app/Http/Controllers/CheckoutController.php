<?php

namespace App\Http\Controllers;

use App\Models\Fee;
use App\Models\Transaction;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function execPostRequest($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data)
            )
        );
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        //execute post
        $result = curl_exec($ch);
        //close connection
        curl_close($ch);
        return $result;
    }

    public function momo_payment(Request $request)
    {
        $feeId = $request->input('fee_id');

        // Kiểm tra fee_id
        $fee = Fee::find($feeId);
        if (!$fee) {
            return redirect()->back()->with('error', 'Không tìm thấy hóa đơn học phí!');
        }
        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        $partnerCode = 'MOMOBKUN20180529';
        $accessKey = 'klm05TvNBzhg7h7j';
        $secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
        $orderInfo = "Thanh toán qua MoMo";
        // $amount = 10000;
        $amount = $fee->total_amount - $fee->amount;
        $orderId = time() . "";
        // url khi thanh toan thanh cong
        $redirectUrl = url('/payment-success');
        $ipnUrl = url('/payment-callback');

        $extraData = "";


        $requestId = time() . "";
        $requestType = "payWithATM";
        // $extraData = ($_POST["extraData"] ? $_POST["extraData"] : "");
        //before sign HMAC SHA256 signature
        $rawHash = "accessKey=" . $accessKey . "&amount=" . $amount . "&extraData=" . $extraData . "&ipnUrl=" . $ipnUrl . "&orderId=" . $orderId . "&orderInfo=" . $orderInfo . "&partnerCode=" . $partnerCode . "&redirectUrl=" . $redirectUrl . "&requestId=" . $requestId . "&requestType=" . $requestType;
        $signature = hash_hmac("sha256", $rawHash, $secretKey);
        // dd($signature);
        $data = array(
            'partnerCode' => $partnerCode,
            'partnerName' => "Test",
            "storeId" => "MomoTestStore",
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'lang' => 'vi',
            'extraData' => $extraData,
            'requestType' => $requestType,
            'signature' => $signature
        );


        $result = $this->execPostRequest($endpoint, json_encode($data));
        // return dd($amount,$result);
        $jsonResult = json_decode($result, true);  // decode json

        //Just a example, please check more in there
        return redirect()->to($jsonResult['payUrl']);
    }

    public function handleCallback(Request $request)
{
    $data = $request->all();
    // return response()->json(['message' => $data] );
    // Kiểm tra dữ liệu có chứa tham số 'extraData' không
    if (!isset($data['extraData'])) {
        return response()->json(['message' => 'Missing extraData parameter'], 400);
    }

    // Lấy dữ liệu 'extraData' và giải mã
    parse_str($data['extraData'], $extraData);

    // Lấy fee_id từ extraData
    $feeId = $extraData['fee_id'] ?? null;

    // Kiểm tra tính hợp lệ của fee_id
    if (!$feeId) {
        return response()->json(['message' => 'Missing fee_id'], 400);
    }

    // Xác thực chữ ký từ MoMo
    $calculatedSignature = hash_hmac('sha256', $data['orderId'] . $data['amount'] . $data['resultCode'], env('MOMO_SECRET_KEY'));

    if ($calculatedSignature !== $data['signature']) {
        return response()->json(['message' => 'Invalid signature'], 400);
    }

    // Kiểm tra kết quả giao dịch
    if ($data['resultCode'] == 0) { // Thanh toán thành công
        // Tìm Fee dựa trên feeId
        $fee = Fee::find($feeId);

        if ($fee) {
            // Cập nhật số tiền đã thanh toán
            $fee->amount += $data['amount'];

            // Nếu số tiền đã thanh toán đủ, cập nhật trạng thái thành 'paid'
            if ($fee->amount >= $fee->total_amount) {
                $fee->status = 'paid';
            }

            $fee->save();

            // Lưu giao dịch vào bảng `transactions`
            Transaction::create([
                'fee_id' => $fee->id,
                'payment_date' => now(),
                'amount_paid' => $data['amount'],
                'payment_method' => 'momo',
                'receipt_number' => $data['transId'],
            ]);

            return response()->json(['message' => 'Payment processed successfully'], 200);
        }

        return response()->json(['message' => 'Fee not found'], 400);
    }

    return response()->json(['message' => 'Payment failed'], 400);
}

}
