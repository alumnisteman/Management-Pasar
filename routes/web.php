<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('landing');
});

Route::get('/admin/{path?}', function () {
    return view('admin');
})->where('path', '.*');

Route::get('/porter', function () {
    return view('porter');
});

Route::get('/porter.html', function () {
    return view('porter');
});

Route::get('/trader/{id}/id-card', function () {
    return view('id_card');
});
