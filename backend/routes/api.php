<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::group(["prefix" => "v1"], function(){ // Example prefix

    // --- Unauthenticated Routes ---
    Route::group(["prefix" => "guest"], function(){
        Route::post('/register', [AuthController::class, 'register'])->name('api.register');
        Route::post('/login', [AuthController::class, 'login'])->name('api.login');
    });

    // --- Authenticated Routes ---
    Route::group(["middleware" => "auth:sanctum"], function(){

        // Common Authenticated Routes
        Route::get('/user', [AuthController::class, 'user'])->name('api.user');
        Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');

        // Admin Routes
        Route::group(["prefix" => "admin", "middleware" => "isAdmin"], function(){
             Route::get('/dashboard', [AdminDashboardController::class, "dashboard"]);
        });

    });
});