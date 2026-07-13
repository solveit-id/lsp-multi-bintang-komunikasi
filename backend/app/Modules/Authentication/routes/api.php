<?php

declare(strict_types=1);

use App\Modules\Authentication\Controllers\ChangePasswordController;
use App\Modules\Authentication\Controllers\LoginController;
use App\Modules\Authentication\Controllers\LogoutController;
use App\Modules\Authentication\Controllers\MeController;
use App\Modules\Authentication\Controllers\UpdateProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->name('auth.')->group(function (): void {

    Route::post('/login', LoginController::class)->name('login');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/me', MeController::class)->name('me');
        Route::post('/logout', LogoutController::class)->name('logout');
        Route::put('/profile', UpdateProfileController::class)->name('profile.update');
        Route::put('/password', ChangePasswordController::class)->name('password.change');
    });

});
