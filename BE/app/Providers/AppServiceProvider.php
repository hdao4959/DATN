<?php

namespace App\Providers;

use App\Repositories\Contracts\GradeRepositoryInterface;
use App\Repositories\Contracts\SubjectRepositoryInterface;
use App\Repositories\Contracts\TimeSlotRepositoryInterface;
use App\Repositories\GradeRepository;
use App\Repositories\SubjectRepository;
use App\Repositories\TimeSlotRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(SubjectRepositoryInterface::class , SubjectRepository::class);
        $this->app->bind(TimeSlotRepositoryInterface::class , TimeSlotRepository::class );
        $this->app->bind(GradeRepositoryInterface::class , GradeRepository::class );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
