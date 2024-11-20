<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Category;
use App\Models\Fee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getRoomCount() {
        try{
            $data = Category::where('type','school_room')->count();
            return response()->json(['countRoom' => $data]);
        }catch(\Exception $e){
            return response()->json(['message' => $e->getMessage() ]);
        }
    }

    public function getStudentCountByMajor() {
        try{
            $data = User::select('major_code',  DB::raw('COUNT(*) as total'))
                    ->groupBy('major_code')
                    ->get();

            return response()->json( $data);
        }catch(\Exception $e){
            return response()->json(['message' => $e->getMessage() ]);
        }
    }

    public function getTeacherCount() {
        // Code logic
    }

    public function getStatusFeesByDate(){
        try{
            $data = Fee::select('status','start_date', 'due_date', DB::raw('COUNT(*) as count'))
                    ->groupBy('status','start_date', 'due_date')->get();

                    $result = $data->reduce(function ($carry, $item) {
                        $key = "{$item->start_date} - {$item->due_date}";

                        if (!isset($carry[$key])) {
                            $carry[$key] = [
                                'pending' => 0,
                                'paid' => 0,
                                'unpaid' => 0
                            ];
                        }

                        $carry[$key][$item->status] = $item->count;

                        return $carry;
                    }, []);

            return response()->json( $result);
        }catch(\Exception $e){
            return response()->json(['message' => $e->getMessage() ]);

        }
    }

    public function getStatusFeesAll(){
        try{
            $data = Fee::select('status',DB::raw('COUNT(*) as count'))
            ->groupBy('status')->get();

            $result = $data->reduce(function ($carry, $item) {
                $key = "status-fee";

                if (!isset($carry[$key])) {
                    $carry[$key] = [
                        'pending' => 0,
                        'paid' => 0,
                        'unpaid' => 0
                    ];
                }

                $carry[$key][$item->status] = $item->count;

                return $carry;
            }, []);

            return response()->json( $result);
        }catch(\Exception $e){
            return response()->json(['message' => $e->getMessage() ]);
        }
    }

    public function getStatusAttendances(){
        try{
             $data = Attendance::select('status',DB::raw('COUNT(*) as count'))
                    ->groupBy('status')->get();
                    
            $result = $data->reduce(function ($carry, $item) {
            $key = "status-attendances";

            if (!isset($carry[$key])) {
                $carry[$key] = [
                    'absent' => 0,
                    'present' => 0,
                ];
            }
            $carry[$key][$item->status] = $item->count;
            return $carry;
            }, []);

            return response()->json($result);
        }catch(\Exception $e){
            return response()->json(['message' => $e->getMessage() ]);
        }
    }

    public function getRecentActivities() {
        // Code logic
    }
}
