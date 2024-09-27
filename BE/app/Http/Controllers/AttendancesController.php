<?php

namespace App\Http\Controllers;

use App\Models\Attendances;
use App\Http\Requests\StoreAttendancesRequest;
use App\Http\Requests\UpdateAttendancesRequest;

class AttendancesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreAttendancesRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreAttendancesRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Attendances  $attendances
     * @return \Illuminate\Http\Response
     */
    public function show(Attendances $attendances)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Attendances  $attendances
     * @return \Illuminate\Http\Response
     */
    public function edit(Attendances $attendances)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateAttendancesRequest  $request
     * @param  \App\Models\Attendances  $attendances
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateAttendancesRequest $request, Attendances $attendances)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Attendances  $attendances
     * @return \Illuminate\Http\Response
     */
    public function destroy(Attendances $attendances)
    {
        //
    }
}
