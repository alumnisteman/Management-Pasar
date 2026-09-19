<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('landing');
});

Route::get('/admin', function () {
    return view('admin');
});

Route::get('/porter', function () {
    return view('porter');
});

Route::get('/porter.html', function () {
    return view('porter');
});

Route::get('/trader/{id}/id-card', function () {
    return view('id_card');
});
