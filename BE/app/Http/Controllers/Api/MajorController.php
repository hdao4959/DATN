<?php

namespace App\Http\Controllers\Api;

use App\Models\Major;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\MajorRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MajorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Major::get();

        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MajorRequest $request)
    {

        try {
            $params = $request->except('_token');
            if ($request->hasFile('image')) {
                $fileName = $request->file('image')->store('uploads/image', 'public');
            } else {
                $fileName = null;
            }
            $params['image'] = $fileName;
            Major::create($params);

            return response()->json([
                'message' => 'Tạo mới thành công',
                'data' => $params
            ]); 
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);
           
            return response()->json([
                'message' => 'Lỗi không xác định'
            ], 500);                
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $data = Major::query()->findOrFail($id);

            return response()->json([
                'message' => 'Chi tiết chuyên ngành = ' . $id,
                'data' => $data
            ]);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);
            if ($th instanceof ModelNotFoundException) {
                return response()->json([
                    'message' => 'Không tồn tại id = ' . $id
                ], 404);
            }
            else {
                return response()->json([
                    'message' => 'Lỗi không xác định'
                ], 500);                
            }

        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MajorRequest $request, string $id)
    {
        try {
            $params = $request->except('_token', '_method');
            $listMajor = Major::findOrFail($id);
            if ($request->hasFile('image')) {
                if ($listMajor->image && Storage::disk('public')->exists($listMajor->image)) {
                    Storage::disk('public')->delete($listMajor->image);
                }
                $fileName = $request->file('image')->store('uploads/major', 'public');
            } else {
                $fileName = $listMajor->image;
            }
            $params['image'] = $fileName;
            $listMajor->update($params);
    
            return response()->json([
                'message' => 'Sửa thành công',
                'data' => $listMajor
            ], 201);
        } catch (\Throwable $th) {
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
            $listMajor = Major::findOrFail($id);
            if ($listMajor->image && Storage::disk('public')->exists($listMajor->image)) {
                Storage::disk('public')->delete($listMajor->image);
            }
            $listMajor->delete($listMajor);
    
            return response()->json([
                'message' => 'Xoa thanh cong'
            ], 404);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [$th]);
           
            return response()->json([
                'message' => 'Lỗi không xác định'
            ], 500);    
        }
    }

    public function getAllMajor (string $type) {
        // dd($type);
        $data = DB::table('majors')->where('type','=', $type)->get();
        return response()->json($data);
    }
}
