<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/database', function () {
    abort_unless(app()->environment('local'), 404);

    $tables = collect(DB::select("
        select name
        from sqlite_master
        where type = 'table'
        and name not like 'sqlite_%'
        order by name
    "))->pluck('name')->values();

    $selectedTable = request('table');
    if (! $selectedTable || ! $tables->contains($selectedTable)) {
        $selectedTable = $tables->first();
    }

    $columns = $selectedTable ? Schema::getColumnListing($selectedTable) : [];
    $rows = $selectedTable ? DB::table($selectedTable)->limit(50)->get() : collect();

    return response()->make(view('database-browser', [
        'tables' => $tables,
        'selectedTable' => $selectedTable,
        'columns' => $columns,
        'rows' => $rows,
    ]));
});
