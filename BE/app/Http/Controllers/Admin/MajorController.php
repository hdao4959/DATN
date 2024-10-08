<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Major\StoreMajorRequest;
use App\Http\Requests\Major\UpdateMajorRequest;

class MajorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $data = Category::where('type', '=', 'major')->paginate(20);
            // $search = $request->input('search');
            // $data = Category::where('type', '=', 'major')
            //                     ->when($search, function ($query, $search) {
            //                         return $query
            //                                 ->where('cate_name', 'like', "%{$search}%");
            //                                 // ->orwhere('ma_san_pham', 'like', "%{$search}%");
            //                     })
            //                     ->paginate(4);
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
    public function store(StoreMajorRequest $request)
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
            $major = Category::where('id', $id)->first();
            if (!$major) {
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
    public function update(UpdateMajorRequest $request, string $id)
    {
        try {
            $major = Category::where('id', $id)->first();
            if (!$major) {
                return response()->json([
                    'message' => "Chuyên ngành không tồn tại!"
                ], 404);
            } else {
                $params = $request->except('_token', '_method');
                $listMajor = Category::findOrFail($id);
                if ($request->hasFile('image')) {
                    if ($listMajor->image && Storage::disk('public')->exists($listMajor->image)) {
                        Storage::disk('public')->delete($listMajor->image);
                    }
                    $fileName = $request->file('image')->store('uploads/image', 'public');
                } else {
                    $fileName = $listMajor->image;
                }
                $params['image'] = $fileName;
                $listMajor->update($params);

                return response()->json([
                    'message' => 'Sửa thành công',
                    'data' => $listMajor
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
            $major = Category::where('id', $id)->first();
            if (!$major) {
                return response()->json([
                    'message' => "Chuyên ngành không tồn tại!"
                ], 404);
            } else {
                $listMajor = Category::findOrFail($id);
                if ($listMajor->image && Storage::disk('public')->exists($listMajor->image)) {
                    Storage::disk('public')->delete($listMajor->image);
                }
                $listMajor->delete($listMajor);

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

    public function getAllMajor(string $type)
    {
        // dd($type);
        $data = DB::table('categories')->where('type', '=', $type)->get();
        return response()->json($data);
    }

    public function getListMajor(string $type)
    {
        // Lấy tất cả danh mục cha
        // dd($type);
        $categories = DB::table('categories')
            ->where('type', '=', $type)
            ->where('parrent_code', '=', "")
            // ->whereNull('parrent_code')
            ->get();
        // dd($categories);
        // return;

        // Duyệt qua từng danh mục cha để lấy danh mục con
        $data = $categories->map(function ($category) {
            // Lấy danh mục con dựa trên parent_code
            $subCategories = DB::table('categories')
                ->where('parrent_code', '=', $category->cate_code)
                ->get();

            // Trả về cấu trúc dữ liệu theo yêu cầu
            return [
                'id' => $category->id,
                'cate_code' => $category->cate_code,
                'cate_name' => $category->cate_name,
                'image' => $category->image,
                'description' => $category->description,
                'listItem'  => $subCategories
            ];
        });

        //Cách 2

        return response()->json($data);
    }

    public function bulkUpdateType(Request $request)
    {
        try {
            $activies = $request->input('is_active'); // Lấy dữ liệu từ request            
            foreach ($activies as $id => $active) {
                // Tìm category theo ID và cập nhật trường 'type'
                $category = Category::findOrFail($id);
                $category->ia_active = $active;
                $category->save();
            }

            return response()->json([
                'message' => 'Loại đã được cập nhật thành công!'
            ], 200);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

            return response()->json([
                'message' => 'Lỗi không xác định'
            ], 500);
        }
    }    
}
