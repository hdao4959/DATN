<?php

namespace App\Http\Controllers\Admin;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\SchoolRoom\StoreSchoolRoomRequest;
use App\Http\Requests\SchoolRoom\UpdateSchoolRoomRequest;
use Illuminate\Support\Facades\Log;

class SchoolRoomController extends Controller
{
    // Hàm trả về json khi id không hợp lệ
    public function handleInvalidId()
    {

        return response()->json([
            'message' => 'Không có Phòng Học nào!',
        ], 404);
    }

    //  Hàm trả về json khi lỗi không xác định (500)
    public function handleErrorNotDefine($th)
    {
        Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

        return response()->json([
            'message' => 'Lỗi không xác định!'
        ], 500);
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Tìm kiếm theo cate_name
            $search = $request->input('search');
            $data = Category::where('type', '=', 'school_room')
                                ->when($search, function ($query, $search) {

                                    return $query
                                            ->where('cate_name', 'like', "%{$search}%");
                                })
                                ->paginate(4);
            if ($data->isEmpty()) {

                return $this->handleInvalidId();
            }


            return response()->json($data, 200);
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSchoolRoomRequest $request)
    {
        try {
            // Lấy ra cate_code và cate_name của cha
            $parent = Category::whereNull('parrent_code')
                                ->where('type', '=', 'school_room')
                                ->select('cate_code', 'cate_name')
                                ->get();

            $params = $request->except('_token');

            if ($request->hasFile('image')) {
                $fileName = $request->file('image')->store('uploads/image', 'public');
            } else {
                $fileName = null;
            }

            $params['image'] = $fileName;
            Category::create($params);

            return response()->json($params, 200);
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $schoolRoom = Category::where('id', $id)->first();
            if (!$schoolRoom) {

                return $this->handleInvalidId();
            } else {
                $data = Category::query()->findOrFail($id);


                return response()->json($data, 200);

            }
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSchoolRoomRequest $request, string $id)
    {
        try {
            // Lấy ra cate_code và cate_name của cha
            $parent = Category::whereNull('parrent_code')
                                ->where('type', '=', 'school_room')
                                ->select('cate_code', 'cate_name')
                                ->get();

            $schoolRoom = Category::where('id', $id)->first();
            if (!$schoolRoom) {

                return $this->handleInvalidId();
            } else {
                $params = $request->except('_token', '_method');
                $listSchoolRoom = Category::findOrFail($id);
                if ($request->hasFile('image')) {
                    if ($listSchoolRoom->image && Storage::disk('public')->exists($listSchoolRoom->image)) {
                        Storage::disk('public')->delete($listSchoolRoom->image);
                    }
                    $fileName = $request->file('image')->store('uploads/image', 'public');
                } else {
                    $fileName = $listSchoolRoom->image;
                }
                $params['image'] = $fileName;
                $listSchoolRoom->update($params);

                return response()->json($listSchoolRoom, 201);
            }
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $schoolRoom = Category::where('id', $id)->first();
            if (!$schoolRoom) {

                return $this->handleInvalidId();
            } else {
                $listSchoolRoom = Category::findOrFail($id);
                if ($listSchoolRoom->image && Storage::disk('public')->exists($listSchoolRoom->image)) {
                    Storage::disk('public')->delete($listSchoolRoom->image);
                }
                $listSchoolRoom->delete($listSchoolRoom);

                return response()->json([
                    'message' => 'Xóa thành công'
                ], 200);
            }
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    public function bulkUpdateType(Request $request)
    {
        try {
            $activies = $request->input('is_active'); // Lấy dữ liệu từ request
            foreach ($activies as $id => $active) {
                // Tìm category theo ID và cập nhật trường 'is_active'
                $category = Category::findOrFail($id);
                $category->ia_active = $active;
                $category->save();
            }

            return response()->json([
                'message' => 'Trạng thái đã được cập nhật thành công!'
            ], 200);
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }
}
