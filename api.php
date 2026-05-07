<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\StallController;
use App\Http\Controllers\GridController;
use App\Http\Controllers\MarketController;

use App\Http\Controllers\ReportController;
use App\Http\Controllers\PermitController;
use App\Http\Controllers\IdentityController;
use App\Http\Controllers\ReputationController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SyncController;
use App\Http\Controllers\PatrolController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\GISController;
use App\Http\Controllers\FieldOpsController;
use App\Http\Controllers\TraderVerificationController;
use App\Http\Controllers\AISummaryController;

Route::get('/ping', function() { return response()->json(['status' => 'pong']); });

// SMOS Intelligence Endpoints
Route::get('/ai/brief', [AISummaryController::class, 'brief']);
Route::get('/gis/stalls', [GISController::class, 'getStalls']);
Route::get('/market/occupancy', function() {
    return Cache::remember('market-occupancy', 60, function () {
        return app(\App\Services\OccupancyService::class)->calculate();
    });
});
Route::post('/field/scan', [FieldOpsController::class, 'scan']);
Route::get('/verify-smos/{permit}', [TraderVerificationController::class, 'verify']);

// Publicly available for the dashboard
Route::apiResource('vendors', VendorController::class);
Route::post('/vendors/{id}/reward', [VendorController::class, 'applyReward']);
Route::apiResource('stalls', StallController::class);
Route::apiResource('reports', ReportController::class);
Route::get('/market/all', [MarketController::class, 'allMarkets']);
Route::get('/market/pulse', [MarketController::class, 'healthPulse']);
Route::get('/market/payments', [MarketController::class, 'latestPayments']);
Route::get('/market/audit', [MarketController::class, 'auditLogs']);
Route::get('/market/predictive', [MarketController::class, 'predictiveInsights']);
Route::get('/market/geo', [MarketController::class, 'geoDistribution']);
Route::get('/market/notifications', [MarketController::class, 'notifications']);
Route::get('/market/report/monthly', [MarketController::class, 'monthlyReport']);
Route::get('/market/report/export', [MarketController::class, 'exportReport']);
Route::get('/market/analytics/revenue', [MarketController::class, 'revenueAnalytics']);
Route::get('/market/analytics/forecast-vs-actual', [MarketController::class, 'forecastVsActual']);
Route::get('/mobile/notifications', [MarketController::class, 'mobileNotifications']);
Route::post('/mobile/notifications/{id}/read', [MarketController::class, 'markNotificationRead']);
Route::post('/market/broadcast', [MarketController::class, 'broadcast']);
Route::get('/market/check-alerts', [MarketController::class, 'checkPerformanceAlerts']);
Route::get('/market/verify/payment/{id}', [MarketController::class, 'verifyPayment']);

Route::post('/grid-book', [GridController::class, 'book']);
Route::get('/grid-slots', [GridController::class, 'slots']);
Route::get('/slots/dynamic-pricing', [GridController::class, 'dynamicPricing']);
Route::get('/heatmap', [GridController::class, 'heatmap']);
Route::get('/heatmap/export', [GridController::class, 'exportHeatmap']);

// Offline-First Sync Bridge
Route::get('/sync/pull', [SyncController::class, 'pull']);
Route::post('/sync/push', [SyncController::class, 'push']);

// Whistleblower
Route::get('/verify/{qr}', [GridController::class, 'verify']);
Route::post('/reports/{id}/verify', [ReportController::class, 'verify']);

// Immutable Receipts
Route::get('/receipt/{id}', [ReceiptController::class, 'generate']);

// JWT Authentication
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);
});

Route::get('/price-logs', [App\Http\Controllers\PriceLogController::class, 'index']);

// Patrol & GPS Tracking
Route::post('/patrol/ping', [PatrolController::class, 'ping']);
Route::get('/patrol/live', [PatrolController::class, 'livePositions']);
Route::get('/market/patrol-logs', [MarketController::class, 'patrolLogs']);

// Digital Permits
Route::post('/permits/issue', [PermitController::class, 'issue']);
Route::get('/permits/verify/{number}', [PermitController::class, 'verify']);
Route::get('/permits/{id}/export', [PermitController::class, 'export']);

// Virtual Identity
Route::get('/trader/batch-id-cards', [IdentityController::class, 'batchGenerate']);

// Settings
Route::get('/settings', [SettingsController::class, 'index']);
Route::get('/settings/group/{group}', [SettingsController::class, 'getGroup']);

Route::group(['middleware' => ['auth:api', 'admin']], function() {
    Route::post('/settings/update', [SettingsController::class, 'update']);
    Route::get('/market/audit', [MarketController::class, 'auditLogs']);
    Route::post('/market/broadcast', [MarketController::class, 'broadcast']);
});
Route::get('/trader/{id}/id-card', [IdentityController::class, 'generateCard']);
Route::get('/trader/{id}/insurance', [IdentityController::class, 'insuranceStatus']);
Route::post('/trader/{id}/insurance/pay', [IdentityController::class, 'payInsurance']);

// Reputation & Rewards
Route::post('/trader/{id}/recalculate', [ReputationController::class, 'recalculate']);
Route::post('/trader/{id}/rate', [ReputationController::class, 'rate']);
Route::post('/vendors/{id}/reward', [ReputationController::class, 'applyReward']);

// Digital Wallet (Cashless)
Route::get('/wallet/{id}/balance', [WalletController::class, 'balance']);
Route::post('/wallet/{id}/topup', [WalletController::class, 'topup']);
Route::post('/wallet/{id}/pay', [WalletController::class, 'pay']);
Route::get('/wallet/{id}/history', [WalletController::class, 'history']);
Route::post('/wallet/batch-pay', [WalletController::class, 'batchPay']);
