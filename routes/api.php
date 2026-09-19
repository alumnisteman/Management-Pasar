<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GridController;
use App\Http\Controllers\CommandCenterController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TraderController;
use App\Http\Controllers\StallController;
use App\Http\Controllers\MarketController;
use App\Http\Controllers\BlockController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MetricsController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\TraderProfileController;
use App\Http\Controllers\CollectionCenterController;
use App\Http\Controllers\InspectionController;
use App\Http\Controllers\ComplaintHelpdeskController;
use App\Http\Controllers\ApprovalCenterController;

use App\Http\Controllers\IncidentController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\GISController;

Route::get('/system/health', [CommandCenterController::class, 'health']);
Route::get('/command-center', [CommandCenterController::class, 'index']);

// GIS & Market Twin Grid
Route::get('/gis', [GISController::class, 'getStalls']);
Route::get('/gis/stalls', [GISController::class, 'getStalls']);
Route::get('/gis/digital-twin', [GISController::class, 'digitalTwin']);
Route::get('/gis/stall/{code}', [GISController::class, 'stallDetail']);
Route::get('/grid-slots', [GridController::class, 'slots']);
Route::get('/grid-slots/heatmap', [GridController::class, 'heatmap']);

// 360 Trader Profile
Route::get('/traders/{id}/full-profile', [TraderProfileController::class, 'fullProfile']);

// Collection Center & Aging
Route::get('/collection/aging', [CollectionCenterController::class, 'agingSummary']);
Route::post('/collection/tasks', [CollectionCenterController::class, 'generateTask']);

// Mobile Inspections
Route::get('/inspections', [InspectionController::class, 'index']);
Route::post('/inspections', [InspectionController::class, 'store']);
Route::get('/inspections/export', [InspectionController::class, 'exportCsv']);

// Helpdesk & Complaints
Route::get('/complaints', [ComplaintHelpdeskController::class, 'index']);
Route::post('/complaints', [ComplaintHelpdeskController::class, 'store']);
Route::put('/complaints/{id}/status', [ComplaintHelpdeskController::class, 'updateStatus']);

// Security & Incidents
Route::get('/incidents', [IncidentController::class, 'index']);
Route::post('/incidents', [IncidentController::class, 'store']);
Route::put('/incidents/{id}/status', [IncidentController::class, 'updateStatus']);

// Communication & Announcements
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::post('/announcements', [AnnouncementController::class, 'store']);
Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);

// Finance & Reconciliation
Route::get('/finance/dashboard', [FinanceController::class, 'dashboard']);
Route::post('/finance/generate-bills', [FinanceController::class, 'generateBills']);
Route::post('/finance/reconcile', [FinanceController::class, 'reconcile']);

// Governance & Approvals
Route::get('/approvals', [ApprovalCenterController::class, 'index']);
Route::post('/approvals', [ApprovalCenterController::class, 'store']);
Route::post('/approvals/{id}/process', [ApprovalCenterController::class, 'process']);

// Intelligence & Analytics
Route::get('/metrics', [MetricsController::class, 'prometheus']);
Route::get('/search', [SearchController::class, 'search']);

// Governance & Security (Auth)
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/pin', [AuthController::class, 'verifyPin']);
Route::get('/auth/me', [AuthController::class, 'me']);
Route::post('/auth/logout', [AuthController::class, 'logout']);

// Operational Modules CRUD
Route::apiResource('traders', TraderController::class);
Route::apiResource('stalls', StallController::class);
Route::apiResource('markets', MarketController::class);
Route::apiResource('blocks', BlockController::class);

// Pelataran & Reports
Route::get('/grid-slots/pelataran', [GridController::class, 'pelataranSlots']);
Route::get('/reports/pelataran',       [ReportController::class, 'pelataranReport']);
Route::get('/reports/pelataran/export', [ReportController::class, 'exportPelataranCsv']);




