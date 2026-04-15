<?php

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BorrowingController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\MaintenanceController;
use App\Http\Controllers\Api\MutationController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/charts', [DashboardController::class, 'charts']);

    // Items
    Route::apiResource('items', ItemController::class);

    // Categories
    Route::apiResource('categories', CategoryController::class);

    // Locations
    Route::apiResource('locations', LocationController::class);

    // Borrowings
    Route::get('/borrowings', [BorrowingController::class, 'index']);
    Route::post('/borrowings', [BorrowingController::class, 'store'])->middleware('role:admin,petugas');
    Route::put('/borrowings/{borrowing}/return', [BorrowingController::class, 'returnItem'])->middleware('role:admin,petugas');

    // Mutations
    Route::get('/mutations', [MutationController::class, 'index']);
    Route::post('/mutations', [MutationController::class, 'store'])->middleware('role:admin,petugas');

    // Maintenance
    Route::get('/maintenances', [MaintenanceController::class, 'index']);
    Route::post('/maintenances', [MaintenanceController::class, 'store'])->middleware('role:admin,petugas');
    Route::put('/maintenances/{maintenance}', [MaintenanceController::class, 'update'])->middleware('role:admin,petugas');

    // Reports
    Route::middleware('role:admin,petugas')->group(function () {
        Route::get('/reports/items/pdf', [ReportController::class, 'exportPdf']);
        Route::get('/reports/items/excel', [ReportController::class, 'exportExcel']);
    });

    // Activity Logs
    Route::get('/activity-logs', [ActivityLogController::class, 'index'])->middleware('role:admin');
});
