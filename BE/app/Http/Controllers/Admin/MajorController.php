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
    // Hàm trả về json khi id không hợp lệ
    public function handleInvalidId()
    {
        return response()->json([
            'message' => 'Không có chuyên ngành nào!',
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
            $data = Category::where('type', '=', 'major')
                                ->when($search, function ($query, $search) {
                                    return $query
                                            ->where('cate_name', 'like', "%{$search}%");
                                })
                                ->paginate(4);
            if ($data->isEmpty()) {
                return $this->handleInvalidId();
            }
            return response()->json([
                'data' => $data
            ],200);
        } catch (Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMajorRequest $request)
    {
        try {
            // Lấy ra cate_code và cate_name của cha
            $parent = Category::whereNull('parrent_code')
                                ->where('type', '=', 'major')
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

            return response()->json([
                'message' => 'Tạo mới thành công',
                'data' => $params
            ]);
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
            $major = Category::where('id', $id)->first();
            if (!$major) {
                return $this->handleInvalidId();
            } else {
                $data = Category::query()->findOrFail($id);

                return response()->json([
                    'message' => 'Chi tiết danh muc = ' . $id,
                    'data' => $data
                ]);                
            }
        } catch (\Throwable $th) {
            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMajorRequest $request, string $id)
    {
        try {
            // Lấy ra cate_code và cate_name của cha
            $parent = Category::whereNull('parrent_code')
                                ->where('type', '=', 'major')
                                ->select('cate_code', 'cate_name')
                                ->get();

            $major = Category::where('id', $id)->first();
            if (!$major) {
                return $this->handleInvalidId();
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
            return $this->handleErrorNotDefine($th);
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
                return $this->handleInvalidId();
            } else {
                $listMajor = Category::findOrFail($id);
                if ($listMajor->image && Storage::disk('public')->exists($listMajor->image)) {
                    Storage::disk('public')->delete($listMajor->image);
                }
                $listMajor->delete($listMajor);

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

    // public function getListMajor(string $type)
    // {
    //     // Lấy tất cả danh mục cha
    //     // dd($type);
    //     $categories = DB::table('categories')
    //         ->where('type', '=', $type)
    //         ->where('parrent_code', '=', "")
    //         // ->whereNull('parrent_code')
    //         ->get();
    //     // dd($categories);
    //     // return;

    //     // Duyệt qua từng danh mục cha để lấy danh mục con
    //     $data = $categories->map(function ($category) {
    //         // Lấy danh mục con dựa trên parent_code
    //         $subCategories = DB::table('categories')
    //             ->where('parrent_code', '=', $category->cate_code)
    //             ->get();

    //         // Trả về cấu trúc dữ liệu theo yêu cầu
    //         return [
    //             'id' => $category->id,
    //             'cate_code' => $category->cate_code,
    //             'cate_name' => $category->cate_name,
    //             'image' => $category->image,
    //             'description' => $category->description,
    //             'listItem'  => $subCategories
    //         ];
    //     });

    //     //Cách 2

    //     return response()->json($data);
    // }
}
