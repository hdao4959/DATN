<?php

namespace App\Http\Controllers\Admin;

use App\Models\Newsletter;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class NewsletterController extends Controller
{
    // Hàm trả về json khi id không hợp lệ
    public function handleInvalidId()
    {

        return response()->json([
            'message' => 'Không có newsletter nào!',
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
            $newsletters = Newsletter::with(['category', 'user'])->get()->map(function ($newsletter) {
                return [
                    'id' => $newsletter->id,
                    'title' => $newsletter->title,
                    'content' => $newsletter->content,
                    'image' => $newsletter->image,
                    'expiry_date' => $newsletter->expiry_date,
                    'is_active' => $newsletter->is_active,
                    'cate_name' => $newsletter->category ? $newsletter->category->cate_name : null,
                    'full_name' => $newsletter->user ? $newsletter->user->full_name : null,
                ];
            });


            if ($newsletters->isEmpty()) {

                return $this->handleInvalidId();
            }

            return response()->json([
                'newsletter' => $newsletters
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

            return response()->json($params, 200);
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $cate_code)
    {
        try {
            $listMajor = Category::where('cate_code', $cate_code)->first();
            if (!$listMajor) {

                return $this->handleInvalidId();
            } else {

                return response()->json($listMajor, 200);                
            }
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMajorRequest $request, string $cate_code)
    {
        try {
            // Lấy ra cate_code và cate_name của cha
            $parent = Category::whereNull('parrent_code')
                                ->where('type', '=', 'major')
                                ->select('cate_code', 'cate_name')
                                ->get();

            $listMajor = Category::where('cate_code', $cate_code)->first();
            if (!$listMajor) {

                return $this->handleInvalidId();
            } else {
                $params = $request->except('_token', '_method');
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

                return response()->json($listMajor, 201);          
            }
        } catch (Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $cate_code)
    {
        try {
            $listMajor = Category::where('cate_code', $cate_code)->first();
            if (!$listMajor) {

                return $this->handleInvalidId();
            } else {
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
            foreach ($activies as $cate_code => $active) {
                // Tìm category theo ID và cập nhật trường 'is_active'
                $category = Category::where('cate_code', $cate_code)->first();
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
