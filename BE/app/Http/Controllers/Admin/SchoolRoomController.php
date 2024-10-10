<?php

namespace App\Http\Controllers\Admin;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\SchoolRoom\StoreSchoolRoomRequest;
use App\Http\Requests\SchoolRoom\UpdateSchoolRoomRequest;

class SchoolRoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $data = Category::where('type', '=', 'School Room')->paginate(20);

            if ($data->isEmpty()) {
                return response()->json(
                    ['message' => 'Không có chuyên ngành nào!'],
                    404
                );
            }
            return response()->json($data, 200);
        } catch (Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSchoolRoomRequest $request)
{
    try {
        $params = $request->except('_token');

        if ($request->hasFile('image')) {
            $fileName = $request->file('image')->store('uploads/image', 'public');
        } else {
            $fileName = null;
        }

        $params['image'] = $fileName;
        Category::create($params);

        return response()->json([
            'message' => 'Tạo mới thành công',
            'data' => $params
        ]);
    } catch (\Throwable $th) {
        Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

        return response()->json([
            'message' => 'Lỗi không xác định',
            'error' => $th->getMessage()
        ], 500);
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
                return response()->json([
                    'message' => "Chuyên ngành không tồn tại!"
                ], 404);
            } else {
                $data = Category::query()->findOrFail($id);

                return response()->json([
                    'message' => 'Chi tiết danh muc = ' . $id,
                    'data' => $data
                ]);                
            }
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);
            if ($th instanceof ModelNotFoundException) {
                return response()->json([
                    'message' => 'Không tồn tại id = ' . $id
                ], 404);
            } else {
                return response()->json([
                    'message' => 'Lỗi không xác định'
                ], 500);
            }
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSchoolRoomRequest $request, string $id)
    {
        try {
            $schoolRoom = Category::where('id', $id)->first();
            if (!$schoolRoom) {
                return response()->json([
                    'message' => "Chuyên ngành không tồn tại!"
                ], 404);
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

                return response()->json([
                    'message' => 'Sửa thành công',
                    'data' => $listSchoolRoom
                ], 201);          
            }
        } catch (Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định'
            ], 500);
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
                return response()->json([
                    'message' => "Chuyên ngành không tồn tại!"
                ], 404);
            } else {
                $listSchoolRoom = Category::findOrFail($id);
                if ($listSchoolRoom->image && Storage::disk('public')->exists($listSchoolRoom->image)) {
                    Storage::disk('public')->delete($listSchoolRoom->image);
                }
                $listSchoolRoom->delete($listSchoolRoom);

                return response()->json([
                    'message' => 'Xoa thanh cong'
                ], 200);            
            }
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định'
            ], 500);
        }
    }
}
