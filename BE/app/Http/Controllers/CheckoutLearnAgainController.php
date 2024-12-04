<?php

namespace App\Http\Controllers;

use App\Models\Score;
use App\Models\Service;
use Illuminate\Http\Request;

class CheckoutLearnAgainController extends Controller
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
        $ServiceId = $request->input('id');
        $user_code = $request->user_code;
        $subject_code = $request->subject_code;

        if (!$user_code || !$subject_code) {
            return redirect()->back()->with('error', '1.Thiếu thông tin user_code hoặc subject_code!');
        }
        // Kiểm tra fee_id
        $service = Service::find($ServiceId);
        if (!$service) {
            return redirect()->back()->with('error', 'Không tìm thấy dịch vụ!');
        }

        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        $partnerCode = 'MOMOBKUN20180529';
        $accessKey = 'klm05TvNBzhg7h7j';
        $secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
        $orderInfo = "Thanh toán qua MoMo";
        // $amount = 10000;
        $amount = $service->amount;
        // $amount = $fee->total_amount ;
        $orderId = time() . "";
        // url khi thanh toan thanh cong
        $redirectUrl = url('/payment-success/learn-again');
        $ipnUrl = url('/payment-callback/learn-again');

        $extraData = json_encode(['id' => $service->id,'user_code'=>$user_code,'subject_code'=>$subject_code]);


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
        if (!isset($jsonResult['payUrl'])) {
            return redirect()->back()->with('error', 'Không thể tạo liên kết thanh toán. Vui lòng thử lại!');
        }

        return redirect()->to($jsonResult['payUrl']);
    }

    public function handleCallback(Request $request)
    {
        $data = $request->all();
        if (!isset($data['extraData'])) {
            return response()->json(['message' => 'Missing extraData parameter'], 400);
        }

        $extraData = json_decode($data['extraData'], true);

        // dd($extraData);

        if (!isset($extraData['user_code']) || !isset($extraData['subject_code'])) {
            return response()->json(['error' => '2.Thiếu thông tin student_code hoặc subject_code!'], 400);
        }

        if (!isset($extraData['id'])) {
            return response()->json(['error' => 'Không tìm thấy id trong extraData!'], 400);
        }
        $service = Service::find($extraData['id']);

        $score = Score::where('student_code', $extraData['user_code'])
              ->where('subject_code', $extraData['subject_code']);

        if (!$score) {
                return response()->json(['error' => 'Không tìm thấy bản ghi Score!'], 404);
        }

        if (!$service) {
            return response()->json(['error' => 'Không tìm thấy dịch vụ!'], 404);
        }

        if ($data['resultCode'] == 0) {
            $service->status = 'approved';
            $service->save();
            $score->update(['status'=>true]);
            return response()->json(['message' => 'Thanh toán thành công!', 'service' => $service], 200);
        } else {
            // Thanh toán thất bại, trả về thông báo lỗi
            return response()->json(['message' => 'Thanh toán thất bại', 'error_message' => $data['message']], 400);
        }
    }

}
