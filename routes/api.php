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
use App\Http\Controllers\CommandCenterController;
use App\Http\Controllers\PelatihanController;
use App\Http\Controllers\IotMeterController;
use App\Http\Controllers\TenantPortalController;
use App\Http\Controllers\AiAnalyticsController;
use App\Http\Controllers\SearchController;

Route::get('/ping', function() { return response()->json(['status' => 'pong']); });
Route::get('/search', [SearchController::class, 'search']);

// SVMS 6.0 Advanced Premium Modules Endpoints
Route::get('/admin/stall-map/data', [GridController::class, 'getMapData']);
Route::post('/admin/stall-map/update-coordinates', [GridController::class, 'updateCoordinates']);

Route::get('/admin/iot/readings', [IotMeterController::class, 'index']);
Route::post('/iot/sim-reading', [IotMeterController::class, 'storeSimulation']);

Route::get('/tenant/dashboard/{trader_id}', [TenantPortalController::class, 'getDashboard']);
Route::post('/tenant/pay-bill', [TenantPortalController::class, 'payBill']);
Route::post('/tenant/complaint', [TenantPortalController::class, 'submitComplaint']);

Route::get('/admin/analytics/predictive', [AiAnalyticsController::class, 'getPredictions']);
Route::get('/admin/analytics/foot-traffic', [AiAnalyticsController::class, 'getFootTraffic']);

// SMOS Intelligence Endpoints
Route::get('/ai/brief', [AISummaryController::class, 'brief']);
Route::get('/gis/stalls', [GISController::class, 'getStalls']);
Route::get('/market/occupancy', function() {
    return \Cache::remember('market-occupancy', 60, function () {
        return resolve(\App\Services\OccupancyService::class)->calculate();
    });
});
Route::post('/field/scan', [FieldOpsController::class, 'scan']);
Route::get('/verify-smos/{number}', [PermitController::class, 'verify']);

// Executive Command Center
Route::group(['middleware' => ['auth:api', 'admin']], function() {
    Route::get('/system/health', [CommandCenterController::class, 'getStats']);
    Route::post('/system/auto-heal', [CommandCenterController::class, 'autoHeal']);
});
Route::get('/command-center/stats', [CommandCenterController::class, 'getStats']);
Route::get('/system/guard-probe', [CommandCenterController::class, 'getHealthStatus']);
Route::get('/command-center/heatmap', [GridController::class, 'heatmap']);

// Publicly available for the dashboard
Route::apiResource('vendors', VendorController::class);
Route::post('/vendors/{id}/relocate', [VendorController::class, 'relocate']);
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
Route::post('/grid-slots/{id}/vacate', [GridController::class, 'vacate']);
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
Route::get('/receipt/verify/{receiptNumber}', [ReceiptController::class, 'verify']);

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
Route::apiResource('permits', PermitController::class);
Route::post('/permits/issue', [PermitController::class, 'issue']);
Route::post('/permits/{id}/renew', [PermitController::class, 'renew']);
Route::get('/permits/verify/{number}', [PermitController::class, 'verify']);
Route::get('/permits/{id}/export', [PermitController::class, 'export']);

// Virtual Identity
Route::get('/trader/batch-id-cards', [IdentityController::class, 'batchGenerate']);

// Settings
Route::get('/settings', [SettingsController::class, 'index']);
Route::get('/settings/group/{group}', [SettingsController::class, 'getGroup']);

Route::group(['middleware' => ['auth:api', 'admin']], function() {
    Route::post('/settings/update', [SettingsController::class, 'update']);
});
Route::get('/trader/{id}/id-card', [IdentityController::class, 'generateCard']);
Route::get('/trader/{id}/insurance', [IdentityController::class, 'insuranceStatus']);
Route::post('/trader/{id}/insurance/pay', [IdentityController::class, 'payInsurance']);

// Reputation & Rewards
Route::post('/trader/{id}/recalculate', [ReputationController::class, 'recalculate']);
Route::post('/trader/{id}/rate', [ReputationController::class, 'rate']);
Route::post('/vendors/{id}/reward', [ReputationController::class, 'applyReward']);

// Pemberdayaan UMKM
Route::get('/pelatihan', [PelatihanController::class, 'index']);
Route::post('/pelatihan', [PelatihanController::class, 'store']);
Route::post('/pelatihan/{id}/register', [PelatihanController::class, 'registerTrader']);

// Digital Wallet (Cashless)
Route::get('/wallet/{id}/balance', [WalletController::class, 'balance']);
Route::post('/wallet/{id}/topup', [WalletController::class, 'topup']);
Route::post('/wallet/{id}/pay', [WalletController::class, 'pay']);
Route::get('/wallet/{id}/history', [WalletController::class, 'history']);
Route::post('/wallet/batch-pay', [WalletController::class, 'batchPay']);

// Porter Module (Kuli Panggul)
Route::get('/porters/live', [App\Http\Controllers\PorterController::class, 'live']);
Route::get('/porters', [App\Http\Controllers\PorterController::class, 'index']);
Route::post('/porters', [App\Http\Controllers\PorterController::class, 'store']);
Route::patch('/porters', [App\Http\Controllers\PorterController::class, 'update']);
Route::get('/jobs', [App\Http\Controllers\PorterController::class, 'getJobs']);
Route::post('/jobs', [App\Http\Controllers\PorterController::class, 'storeJob']);
Route::patch('/jobs', [App\Http\Controllers\PorterController::class, 'updateJob']);
Route::get('/incentives', [App\Http\Controllers\PorterController::class, 'getIncentives']);
Route::post('/incentives', [App\Http\Controllers\PorterController::class, 'storeIncentive']);
Route::get('/ratings', [App\Http\Controllers\PorterController::class, 'getRatings']);
Route::post('/ratings', [App\Http\Controllers\PorterController::class, 'storeRating']);
