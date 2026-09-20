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
use App\Http\Controllers\PermitController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\PorterController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\PelatihanController;
use App\Http\Controllers\SyncController;
use App\Http\Controllers\TemporaryController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\ReputationController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\PatrolController;
use App\Http\Controllers\IdentityController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\PriceLogController;
use App\Http\Controllers\TraderVerificationController;
use App\Http\Controllers\FieldOpsController;
use App\Http\Controllers\AISummaryController;

// ============================================================
// SYSTEM & COMMAND CENTER
// ============================================================
Route::get('/system/health', [CommandCenterController::class, 'health']);
Route::get('/command-center', [CommandCenterController::class, 'index']);

// ============================================================
// GIS & MARKET TWIN GRID
// ============================================================
Route::get('/gis', [GISController::class, 'getStalls']);
Route::get('/gis/stalls', [GISController::class, 'getStalls']);
Route::get('/gis/digital-twin', [GISController::class, 'digitalTwin']);
Route::get('/gis/stall/{code}', [GISController::class, 'stallDetail']);
Route::get('/grid-slots', [GridController::class, 'slots']);
Route::get('/grid-slots/heatmap', [GridController::class, 'heatmap']);
Route::get('/grid-slots/pelataran', [GridController::class, 'pelataranSlots']);

// ============================================================
// OPERATIONAL MODULES CRUD
// ============================================================
Route::apiResource('traders', TraderController::class);
Route::apiResource('stalls', StallController::class);
Route::apiResource('markets', MarketController::class);
Route::apiResource('blocks', BlockController::class);

// ============================================================
// TRADER PROFILE & VERIFICATION
// ============================================================
Route::get('/traders/{id}/full-profile', [TraderProfileController::class, 'fullProfile']);
Route::post('/traders/{id}/verify', [TraderVerificationController::class, 'verify']);

// ============================================================
// PERMITS — Manajemen Izin Digital (SIPTU)
// ============================================================
Route::get('/permits', [PermitController::class, 'index']);
Route::post('/permits/issue', [PermitController::class, 'issue']);
Route::get('/permits/{id}/export', [PermitController::class, 'export']);
Route::get('/permits/verify/{permitNumber}', [PermitController::class, 'verify']);

// ============================================================
// COLLECTION CENTER & AGING
// ============================================================
Route::get('/collection/aging', [CollectionCenterController::class, 'agingSummary']);
Route::post('/collection/tasks', [CollectionCenterController::class, 'generateTask']);

// ============================================================
// MOBILE INSPECTIONS
// ============================================================
Route::get('/inspections', [InspectionController::class, 'index']);
Route::post('/inspections', [InspectionController::class, 'store']);
Route::get('/inspections/export', [InspectionController::class, 'exportCsv']);

// ============================================================
// HELPDESK & COMPLAINTS
// ============================================================
Route::get('/complaints', [ComplaintHelpdeskController::class, 'index']);
Route::post('/complaints', [ComplaintHelpdeskController::class, 'store']);
Route::put('/complaints/{id}/status', [ComplaintHelpdeskController::class, 'updateStatus']);

// ============================================================
// SECURITY & INCIDENTS
// ============================================================
Route::get('/incidents', [IncidentController::class, 'index']);
Route::post('/incidents', [IncidentController::class, 'store']);
Route::put('/incidents/{id}/status', [IncidentController::class, 'updateStatus']);

// ============================================================
// COMMUNICATION & ANNOUNCEMENTS
// ============================================================
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::post('/announcements', [AnnouncementController::class, 'store']);
Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);

// ============================================================
// FINANCE & RECONCILIATION
// ============================================================
Route::get('/finance/dashboard', [FinanceController::class, 'dashboard']);
Route::post('/finance/generate-bills', [FinanceController::class, 'generateBills']);
Route::post('/finance/reconcile', [FinanceController::class, 'reconcile']);

// ============================================================
// GOVERNANCE & APPROVALS
// ============================================================
Route::get('/approvals', [ApprovalCenterController::class, 'index']);
Route::post('/approvals', [ApprovalCenterController::class, 'store']);
Route::post('/approvals/{id}/process', [ApprovalCenterController::class, 'process']);

// ============================================================
// INTELLIGENCE & ANALYTICS
// ============================================================
Route::get('/metrics', [MetricsController::class, 'prometheus']);
Route::get('/search', [SearchController::class, 'search']);
Route::get('/ai/summary', [AISummaryController::class, 'summary']);

// ============================================================
// AUTH
// ============================================================
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/pin', [AuthController::class, 'verifyPin']);
Route::get('/auth/me', [AuthController::class, 'me']);
Route::post('/auth/logout', [AuthController::class, 'logout']);

// ============================================================
// PELATARAN & REPORTS
// ============================================================
Route::get('/reports/pelataran', [ReportController::class, 'pelataranReport']);
Route::get('/reports/pelataran/export', [ReportController::class, 'exportPelataranCsv']);

// ============================================================
// WALLET — Dompet Digital Pedagang
// ============================================================
Route::get('/wallet/{traderId}/balance', [WalletController::class, 'balance']);
Route::post('/wallet/{traderId}/topup', [WalletController::class, 'topup']);
Route::post('/wallet/{traderId}/pay', [WalletController::class, 'pay']);
Route::get('/wallet/{traderId}/history', [WalletController::class, 'history']);
Route::post('/wallet/batch-pay', [WalletController::class, 'batchPay']);

// ============================================================
// PORTER — Manajemen Kuli Angkut
// ============================================================
Route::get('/porter', [PorterController::class, 'index']);
Route::post('/porter', [PorterController::class, 'store']);
Route::put('/porter', [PorterController::class, 'update']);
Route::get('/porter/jobs', [PorterController::class, 'getJobs']);
Route::post('/porter/jobs', [PorterController::class, 'storeJob']);
Route::put('/porter/jobs', [PorterController::class, 'updateJob']);
Route::get('/porter/incentives', [PorterController::class, 'getIncentives']);
Route::post('/porter/incentives', [PorterController::class, 'storeIncentive']);
Route::get('/porter/ratings', [PorterController::class, 'getRatings']);
Route::post('/porter/ratings', [PorterController::class, 'storeRating']);

// ============================================================
// MAINTENANCE — Tiket Pemeliharaan & Work Orders
// ============================================================
Route::get('/maintenance', [MaintenanceController::class, 'index']);
Route::post('/maintenance', [MaintenanceController::class, 'store']);
Route::get('/maintenance/{id}', [MaintenanceController::class, 'show']);
Route::put('/maintenance/{id}', [MaintenanceController::class, 'update']);
Route::delete('/maintenance/{id}', [MaintenanceController::class, 'destroy']);

// ============================================================
// PELATIHAN — Program Pelatihan Pedagang
// ============================================================
Route::get('/pelatihan', [PelatihanController::class, 'index']);
Route::post('/pelatihan', [PelatihanController::class, 'store']);
Route::post('/pelatihan/{id}/register', [PelatihanController::class, 'registerTrader']);
Route::put('/pelatihan/{id}/traders/{traderId}/status', [PelatihanController::class, 'updateStatus']);

// ============================================================
// SYNC — Sinkronisasi Offline/Online
// ============================================================
Route::get('/sync/pull', [SyncController::class, 'pull']);
Route::post('/sync/push', [SyncController::class, 'push']);

// ============================================================
// TEMPORARY — Lapak & Izin Sementara
// ============================================================
Route::get('/temporary/stalls', [TemporaryController::class, 'listStalls']);
Route::get('/temporary/permits', [TemporaryController::class, 'listPermits']);
Route::post('/temporary/book', [TemporaryController::class, 'book']);
Route::put('/temporary/permits/{id}/status', [TemporaryController::class, 'updatePermitStatus']);

// ============================================================
// VENDOR — Pedagang Sementara/Tamu
// ============================================================
Route::get('/vendors', [VendorController::class, 'index']);
Route::post('/vendors', [VendorController::class, 'store']);
Route::get('/vendors/{id}', [VendorController::class, 'show']);
Route::put('/vendors/{id}', [VendorController::class, 'update']);
Route::delete('/vendors/{id}', [VendorController::class, 'destroy']);

// ============================================================
// REPUTATION — Sistem Reputasi Pedagang
// ============================================================
Route::get('/reputation/leaderboard', [ReputationController::class, 'leaderboard']);
Route::get('/reputation/{traderId}', [ReputationController::class, 'show']);
Route::post('/reputation/{traderId}/adjust', [ReputationController::class, 'adjust']);

// ============================================================
// SETTINGS — Pengaturan Sistem
// ============================================================
Route::get('/settings', [SettingsController::class, 'index']);
Route::put('/settings', [SettingsController::class, 'update']);

// ============================================================
// PATROL — Patroli Keamanan
// ============================================================
Route::get('/patrol', [PatrolController::class, 'index']);
Route::post('/patrol', [PatrolController::class, 'store']);
Route::get('/patrol/logs', [PatrolController::class, 'logs']);

// ============================================================
// IDENTITY — Verifikasi Identitas
// ============================================================
Route::post('/identity/verify', [IdentityController::class, 'verify']);
Route::get('/identity/{traderId}', [IdentityController::class, 'show']);

// ============================================================
// RECEIPTS — Kuitansi / Bukti Bayar
// ============================================================
Route::get('/receipts/{traderId}', [ReceiptController::class, 'byTrader']);
Route::get('/receipts/download/{id}', [ReceiptController::class, 'download']);

// ============================================================
// PRICE LOG — Riwayat Harga Lapak
// ============================================================
Route::get('/price-logs/{slotId}', [PriceLogController::class, 'index']);
Route::post('/price-logs', [PriceLogController::class, 'store']);

// ============================================================
// FIELD OPS — Operasi Lapangan
// ============================================================
Route::get('/field-ops/tasks', [FieldOpsController::class, 'tasks']);
Route::post('/field-ops/checkin', [FieldOpsController::class, 'checkin']);
