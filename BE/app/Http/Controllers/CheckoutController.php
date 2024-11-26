<?php

namespace App\Http\Controllers;

use App\Models\Fee;
use App\Models\Transaction;
use App\Models\Wallet;
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
        if ($fee->total_amount - $fee->amount <= 0) {
            return dd('error', 'Không tìm thấy hóa đơn học phí!');
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

        $extraData = json_encode(['fee_id' => $fee->id]);


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
        // return response()->json(['message' => $data]);
        // Kiểm tra dữ liệu có chứa tham số 'extraData' không
        if (!isset($data['extraData'])) {
            return response()->json(['message' => 'Missing extraData parameter'], 400);
        }

        $extraData = json_decode($data['extraData'], true);

        if (!isset($extraData['fee_id'])) {
            return response()->json(['error' => 'Không tìm thấy fee_id trong extraData!'], 400);
        }
        $fee = Fee::find($extraData['fee_id']);
        if (!$fee) {
            return response()->json(['error' => 'Không tìm thấy hóa đơn học phí!'], 404);
        }
        // Xác thực chữ ký từ MoMo
        // $calculatedSignature = hash_hmac('sha256', $data['orderId'] . $data['amount'] . $data['resultCode'], env('MOMO_SECRET_KEY'));

        // if ($calculatedSignature !== $data['signature']) {
        //     return response()->json(['message' => 'Invalid signature'], 400);
        // }

        // Kiểm tra kết quả giao dịch
        if ($data['resultCode'] == 0) {
            if ($fee) {
                $amount = $fee->amount += $data['amount'];
                $isFullyPaid = $amount >= $fee->total_amount;

                if ($isFullyPaid) {
                    $fee->status = 'paid';
                }
                // Tìm hoặc tạo ví tiền
                $wallet = Wallet::firstOrCreate(
                    ['user_code' => $fee->user_code],
                    ['total' => 0, 'paid' => 0]
                );

                // Cập nhật thông tin ví
                $wallet->total += $isFullyPaid ? $fee->total_amount : 0;
                $wallet->paid += $data['amount'];
                $wallet->save();
                $fee->save();
                // Tạo giao dịch
                $transactions = [];

                // Giao dịch nạp tiền
                $transactions[] = [
                    'fee_id' => $fee->id,
                    'payment_date' => now(),
                    'amount_paid' => $data['amount'],
                    'payment_method' => 'transfer',
                    'receipt_number' => "",
                    'is_deposit' => 1,
                ];

                // Giao dịch thanh toán đầy đủ
                if ($isFullyPaid) {
                    $transactions[] = [
                        'fee_id' => $fee->id,
                        'payment_date' => now(),
                        'amount_paid' => $fee->total_amount,
                        'payment_method' => 'transfer',
                        'receipt_number' => "",
                        'is_deposit' => 0,
                    ];
                }

                // Lưu giao dịch
                Transaction::insert($transactions);

                return response()->json(['message' => 'Payment processed successfully'], 200);
            }

            return response()->json(['message' => 'Fee not found'], 400);
        }

        return response()->json(['message' => 'Payment failed'], 400);
    }
}
