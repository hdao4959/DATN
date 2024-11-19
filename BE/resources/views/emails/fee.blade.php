<!DOCTYPE html>
<html>
<head>
    <title>Thông báo học phí</title>
</head>
<body>
    <h1>Thông báo học phí kì {{ $data['semester']}}</h1>
    <p>Xin chào, {{ $data['full_name'] }}

    </p>
    <p>Học phí của bạn cho kỳ này là: {{ $data['amount'] }}
         VND</p>
    <p>Hạn đóng học phí: {{ $data['due_date']}}

    </p>

</body>
</html>
