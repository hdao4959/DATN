<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Category::where('type', 'course')
                            ->where('is_active', 1)
                            ->get();

        return response()->json($courses);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $first_year = $request->first_year;
        $final_year = $request->final_year;

        $first_year_short = substr($first_year, -2);  // Lấy 2 chữ số cuối của first_year
        $final_year_short = substr($final_year, -2);


        $cate_code = "COURSE" . $first_year_short . $final_year_short;
        $cate_name = $first_year . '-' . $final_year;

        // Tạo khóa học mới
        $course = Category::create([
            'cate_code' => $cate_code,
            'cate_name' => $cate_name,
            'type'      => 'course',
            'is_active' => 1, // Mặc định là active
        ]);

        return response()->json($course, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code)
    {
        $course = Category::where('type', 'course')->where('cate_code',$code)->get();
        if($course->isEmpty()){
            return response()->json(['message'=>'không tìm thấy']);
        }
        return response()->json($course);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $code)
{
    try{
        // Tìm khóa học theo id
    $course = Category::where('cate_code',$code);

    if($course->isEmpty()){
        return response()->json(['message'=>'không tìm thấy']);
    }
    // Lấy first_year và final_year từ request
    $first_year = $request->first_year;
    $final_year = $request->final_year;

    // Lấy 2 chữ số cuối của first_year và final_year
    $first_year_short = substr($first_year, -2);  // Lấy 2 chữ số cuối của first_year
    $final_year_short = substr($final_year, -2);  // Lấy 2 chữ số cuối của final_year

    // Tạo cate_code theo định dạng yêu cầu
    $cate_code = "COURSE" . $first_year_short . $final_year_short;

    // Tạo cate_name theo định dạng yêu cầu
    $cate_name = $first_year . '-' . $final_year;

    // Cập nhật thông tin khóa học
    $course->update([
        'cate_code' => $cate_code,
        'cate_name' => $cate_name,
    ]);

    // Trả về thông tin khóa học đã được cập nhật
    return response()->json(['message' => 'cập nhật thành công']);
    }catch(\Throwable $th){
        return response()->json(['message'=>$th->getMessage()]);
    }
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code)
    {
        $course = Category::where('cate_code',$code);
        $course->delete();
        return response()->json(['message' => 'Xóa thành công'], 200);
    }
}
