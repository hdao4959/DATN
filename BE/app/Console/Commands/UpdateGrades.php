<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class UpdateGrades extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:grades';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cập nhật điểm tự động';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DB::table('scores_component')
            ->join('users', 'scores_component.student_code', '=', 'users.user_code')
            ->join('classrooms', 'scores_component.class_code', '=', 'classrooms.class_code')
            ->join('categories', 'scores_component.point_head_code', '=', 'categories.cate_code')
            ->leftJoin('scores', function ($join) {
                $join->on('scores_component.student_code', '=', 'scores.student_code')
                    ->on('classrooms.subject_code', '=', 'scores.subject_code');
            })
            ->selectRaw('
        scores_component.student_code, 
        classrooms.subject_code,
        SUM(scores_component.score * categories.value) / SUM(categories.value) AS avg_score ')
            ->groupBy('scores_component.student_code', 'classrooms.subject_code')
            ->cursor()
            ->each(function ($row) {
                DB::table('scores')->updateOrInsert(
                    [
                        'student_code' => $row->student_code,
                        'subject_code' => $row->subject_code,
                    ],
                    [
                        'score' => $row->avg_score,
                        'is_pass' => $row->avg_score >= 5.0,
                        'status' => false,
                        'updated_at' => now(),
                        'created_at' => now(),
                    ]
                );
            });
    }
}
