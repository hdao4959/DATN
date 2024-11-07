<!DOCTYPE html>
<html>
<head>
    <title>Thông báo học phí</title>
</head>
<body>
    <h1>Thông báo học phí</h1>
    <p>Xin chào, {{ $data['name'] }}

    </p>
    <p>Học phí của bạn cho kỳ này là: {{ $data['semester'] }}
         VND</p>
    <p>Hạn đóng học phí: {{ $data['amount']}}

    </p>
</body>
</html>
