<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <form action="{{ route('renderScheduleForClassroom') }}" method="post">
        @csrf
        <div>
            <label for="">Mã lớp</label>
            <input type="text" name="class_code" id="">
        </div>
        <div>
            <label for="">Tên lớp</label>
            <input type="text" name="class_name" id="">
        </div>
        <div>
            <label for="">Môn học</label>
            <select name="subject_code" id="">
                <option value="">--Chọn môn học--</option>
                @foreach ($subjects as $subject)
                    <option value="{{ $subject->subject_code }}">{{ $subject->subject_name }}</option>
                @endforeach
            </select>
        </div>
        <div>
            <label for="">Ca học</label>
            <select name="section" id="">
                <option value="">--Ca học--</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
            </select>
        </div>


        <div>
            <label for="">Các ngày học trong tuần</label><br>
            <select name="study_days[]" id="" multiple>
                <option value="">--Ngày hoc--</option>
                <option value="Mon">Thứ 2</option>
                <option value="Tue">Thứ 3</option>
                <option value="Wed">Thứ 4</option>
                <option value="Thu">Thứ 5</option>
                <option value="Fri">Thứ 6</option>
                <option value="Sat">Thứ 7</option>
            </select>
        </div>

        <div>
            <label for="">Tổng số buổi học</label>
            <input type="number" name="total_sessions">
        </div>

        <div>
            <label for="">Ngày bắt đầu</label>
            <input type="date" name="date_from" id="">
        </div>
        <div class="form-group">
            <label>Chọn phòng học</label>
            <select name="room_code" id="">
                <option value="">--Chọn phòng học--</option>
                @foreach ($rooms as $room)
                <option value="{{ $room->cate_code }}">{{ $room->cate_name }}</option>
            @endforeach
            </select>
            <div id="room-options">
               
            </div>
        </div>
        <button type="submit">Đặt lịch học</button>
    </form>
</body>

</html>
