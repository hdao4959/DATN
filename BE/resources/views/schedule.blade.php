<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

    <style>
        .schedule-card {
            background-color: #f9f9f9;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 8px;
            transition: background-color 0.3s ease;
            text-align: center;
        }


        .btn-save {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        .btn-save:hover {
            background-color: #0056b3;
        }
    </style>
</head>

<body>
    <form action="{{ route('admin.classrooms.store') }}" method="post">
        @csrf
        <div class="container mt-4">
            <h3>Mã lớp: {{ $data['class_code'] }}</h3>
            <input type="hidden" name="class_code" value="{{ $data['class_code'] }}">
            <h3>Môn học: {{ $data['subject_code'] }}</h3>
            <input type="hidden" name="subject_code" value="{{ $data['subject_code'] }}">
            <h3>Ca học: {{ $data['section'] }}</h3>
            <input type="hidden" name="section" value="{{ $data['section'] }}">
            <p>Số buổi học: {{ count($addedDays) }}</p>
            
            <div class="row">
                @foreach ($addedDays as $day)
                    <div class="col-md-2">
                        <div class="schedule-card">
                            <input type="hidden" name="study_days[]" value="{{ $day }}">
                            <h5>{{ date('d-m-Y', strtotime($day)) }}</h5>
                        </div>
                    </div>
                @endforeach
            </div>
            <button class="btn-save" type="submit">Lưu lịch học</button>
        </div>

        <!-- Bootstrap JS -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+0i1Yk5MYYx04ecI4BbJ6tAGlNtR8" crossorigin="anonymous">
        </script>

</body>

</html>
