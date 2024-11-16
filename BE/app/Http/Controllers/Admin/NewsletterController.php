<?php

namespace App\Http\Controllers\Admin;

use Throwable;
use App\Models\Category;
use App\Models\Classroom;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Newsletter\StoreNewsletterRequest;
use App\Http\Requests\Newsletter\UpdateNewsletterRequest;

class NewsletterController extends Controller
{
    // Hàm trả về json khi id không hợp lệ
    public function handleInvalidId()
    {

        return response()->json([
            'message' => 'Không có newsletter nào!',
            'error' => true
        ]);
    }

    //  Hàm trả về json khi lỗi không xác định (500)
    public function handleErrorNotDefine($th)
    {
        Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);

        return response()->json([
            'message' => 'Lỗi không xác định!',
            'error' => true
        ], 500);
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Lấy ra chuyên mục
            $category = Category::where('type', '=', 'category')
                                ->select('cate_code', 'cate_name')
                                ->get();

            $title = $request->input('title');
            $type = $request->input('type');
            $newsletters = Newsletter::with(['category', 'user'])
                ->when($title, function ($query, $title) {
                    return $query
                            ->where('title', 'like', "%{$title}%");
                })
                ->when($type !== null, function ($query) use ($type) {
                    return $query
                            ->where('type', '=', $type);
                })
                ->get()->map(function ($newsletter) {
                    return [
                        'id' => $newsletter->id,
                        'code' => $newsletter->code,
                        'title' => $newsletter->title,
                        'content' => $newsletter->content,
                        'image' => $newsletter->image,
                        'type' => $newsletter->type,
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
                'newsletter' => $newsletters,
                'category' => $category
            ],200);
        } catch (Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNewsletterRequest $request)
    {
        // try {
            $params = $request->except('_token');

            if ($request->hasFile('image')) {
                $fileName = $request->file('image')->store('uploads/image', 'public');
            } else {
                $fileName = null;
            }

            $params['image'] = $fileName;
            Newsletter::create($params);

            return response()->json($params, 200);
        // } catch (\Throwable $th) {

        //     return $this->handleErrorNotDefine($th);
        // }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $code)
    {
        try {
            $newsletters = Newsletter::where('code', $code)
                ->with(['category', 'user'])
                ->get()->map(function ($newsletter) {
                            return [
                                'id' => $newsletter->id,
                                'code' => $newsletter->code,
                                'title' => $newsletter->title,
                                'tags' => $newsletter->tags,
                                'content' => $newsletter->content,
                                'image' => $newsletter->image,
                                'description' => $newsletter->description,
                                'type' => $newsletter->type,
                                'order' => $newsletter->order,
                                'expiry_date' => $newsletter->expiry_date,
                                'is_active' => $newsletter->is_active,
                                'cate_code' => $newsletter->category ? $newsletter->category->cate_code : 'No Category',                                
                                'cate_name' => $newsletter->category ? $newsletter->category->cate_name : 'No Category',
                                'user_code' => $newsletter->user ? $newsletter->user->user_code : 'No User',
                                'full_name' => $newsletter->user ? $newsletter->user->full_name : 'No User',
                            ];
                        });    
            if (!$newsletters) {

                return $this->handleInvalidId();
            } else {

                return response()->json($newsletters, 200);                
            }
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNewsletterRequest $request, string $code)
    {
        try {
            $newsletters = Newsletter::where('code', $code)->lockForUpdate()->first();
            if (!$newsletters) {

                return $this->handleInvalidId();
            } else {
                $params = $request->except('_token', '_method');
                if ($request->hasFile('image')) {
                    if ($newsletters->image && Storage::disk('public')->exists($newsletters->image)) {
                        Storage::disk('public')->delete($newsletters->image);
                    }
                    $fileName = $request->file('image')->store('uploads/image', 'public');
                } else {
                    $fileName = $newsletters->image;
                }
                $params['image'] = $fileName;
                $newsletters->update($params);

                return response()->json($newsletters, 201);          
            }
        } catch (Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code)
    {
        try {
            $newsletters = Newsletter::where('code', $code)->lockForUpdate()->first();
            if (!$newsletters) {

                return $this->handleInvalidId();
            } else {
                if ($newsletters->image && Storage::disk('public')->exists($newsletters->image)) {
                    Storage::disk('public')->delete($newsletters->image);
                }
                $newsletters->delete($newsletters);

                return response()->json([
                    'message' => 'Xóa thành công'
                ], 200);            
            }
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }
    
    public function copyNewsletter(string $code)
    {
        try {
            $newsletters = Newsletter::where('code', $code)->lockForUpdate()->first();
        
            if (!$newsletters) {
                return $this->handleInvalidId();
            }
    
            // Tìm bản copy có số thứ tự lớn nhất
            $maxCopyNumber = Newsletter::where('code', 'LIKE', "{$code}_copy%")
                ->selectRaw('MAX(CAST(SUBSTRING(code, LENGTH(?) + 6) AS UNSIGNED)) as max_copy_number', [$code])
                ->value('max_copy_number');
    
            // Gán số thứ tự tiếp theo
            $nextCopyNumber = $maxCopyNumber ? $maxCopyNumber + 1 : 1;
            $newCode = "{$code}_copy$nextCopyNumber";
    
            // Tạo bản sao bài viết
            $newPost = $newsletters->replicate();
            $newPost->code = $newCode;
            $newPost->title = $newsletters->title . '_copy';
            $newPost->created_at = now();
            $newPost->updated_at = now();
            $newPost->save();

            return response()->json($newPost, 200);
        } catch (\Throwable $th) {

            return $this->handleErrorNotDefine($th);
        }
    }
}
