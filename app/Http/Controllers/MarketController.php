<?php

namespace App\Http\Controllers;

use App\Models\Trader;
use App\Models\AuditLog;
use App\Models\Payment;
use App\Models\Market;
use App\Models\Notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class MarketController extends Controller
{
    public function geoDistribution()
    {
        return Market::select('id', 'name', 'latitude', 'longitude', 'is_active')->get();
    }

    public function allMarkets()
    {
        return Market::all(); // Keep it simple if zones not needed, but adding with() for future
    }

    public function notifications()
    {
        return Notification::orderBy('created_at', 'desc')->limit(20)->get();
    }

    public function healthPulse()
    {
        $totalVendors = Trader::count();
        if ($totalVendors == 0) return \response()->json(['compliance_rate' => 0, 'total_vendors' => 0]);

        $activeVendors = Trader::where('status', 'active')->count();
        $complianceRate = \round(($activeVendors / $totalVendors) * 100);

        return \response()->json([
            'compliance_rate' => $complianceRate,
            'total_vendors' => $totalVendors,
            'active_vendors' => $activeVendors
        ]);
    }

    public function latestPayments()
    {
        return Payment::orderBy('created_at', 'desc')->limit(10)->get();
    }

    public function auditLogs()
    {
        return AuditLog::orderBy('created_at', 'desc')->limit(50)->get();
    }

    public function patrolLogs()
    {
        return DB::table('patrol_logs')
            ->join('users', 'patrol_logs.officer_id', '=', 'users.id')
            ->select('patrol_logs.*', 'users.name as officer_name')
            ->orderBy('patrol_logs.patrol_time', 'desc')
            ->limit(20)
            ->get();
    }

    public function predictiveInsights()
    {
        // Mock AI Logic: Simple projection based on current stats
        $totalVendors = Trader::count();
        $predictedTraffic = \round($totalVendors * 1.5);
        $predictedRevenue = Payment::sum('amount_paid') * 1.2;

        return \response()->json([
            'predicted_revenue_tomorrow' => $predictedRevenue,
            'predicted_vendor_occupancy' => '92%',
            'peak_hour_prediction' => '05:00 - 08:00',
            'anomaly_detection' => 'Normal',
            'recommendation' => 'Tingkatkan patroli di Blok B untuk optimasi levy.'
        ]);
    }

    public function checkPerformanceAlerts()
    {
        $currentHour = \now()->hour;
        $actual = \Illuminate\Support\Facades\DB::table('transactions')
            ->whereDate('transaction_time', \today())
            ->where(\Illuminate\Support\Facades\DB::raw('HOUR(transaction_time)'), '<=', $currentHour)
            ->sum('amount');

        // Simple forecast: 500k per hour
        $forecast = ($currentHour + 1) * 500000;

        if ($actual < ($forecast * 0.7)) {
            Notification::create([
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'title' => '🚨 ANOMALI PENDAPATAN TERDETEKSI',
                'message' => 'Pendapatan hari ini (Rp ' . \number_format($actual) . ') berada 30% di bawah target (Rp ' . \number_format($forecast) . '). Segera lakukan audit lapangan.',
                'type' => 'alert',
                'is_read' => false
            ]);
            return \response()->json(['status' => 'alert_triggered', 'actual' => $actual, 'forecast' => $forecast]);
        }

        return \response()->json(['status' => 'normal', 'actual' => $actual, 'forecast' => $forecast]);
    }

    public function broadcast(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:100',
            'message' => 'required|string',
            'market_id' => 'nullable|exists:markets,id',
            'type' => 'required|string|in:info,warning,urgent'
        ]);

        $notification = Notification::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'title' => \strtoupper($data['type']) . ': ' . $data['title'],
            'message' => $data['message'],
            'type' => $data['type'],
            'is_read' => false
        ]);

        // Log the broadcast in audit log
        \App\Services\AuditLogger::log('BROADCAST', 'SEND_MESSAGE', $data);

        return \response()->json(['status' => 'success', 'notification' => $notification]);
    }

    public function monthlyReport(Request $request)
    {
        $year = $request->input('year', \date('Y'));
        $month = $request->input('month', \date('m'));

        $report = \Illuminate\Support\Facades\DB::table('transactions')
            ->select(\Illuminate\Support\Facades\DB::raw('DATE(transaction_time) as date'), \Illuminate\Support\Facades\DB::raw('SUM(amount) as revenue'), \Illuminate\Support\Facades\DB::raw('COUNT(*) as count'))
            ->whereYear('transaction_time', $year)
            ->whereMonth('transaction_time', $month)
            ->groupBy('date')
            ->get();

        return \response()->json([
            'year' => $year,
            'month' => $month,
            'total_revenue' => $report->sum('revenue'),
            'total_transactions' => $report->sum('count'),
            'daily_breakdown' => $report
        ]);
    }

    public function exportReport(Request $request)
    {
        $year = $request->input('year', \date('Y'));
        $monthNum = $request->input('month', \date('m'));
        $monthName = \date('F', \mktime(0, 0, 0, $monthNum, 1));

        $data = \Illuminate\Support\Facades\DB::table('transactions')
            ->select(\Illuminate\Support\Facades\DB::raw('DATE(transaction_time) as date'), \Illuminate\Support\Facades\DB::raw('SUM(amount) as revenue'), \Illuminate\Support\Facades\DB::raw('COUNT(*) as count'))
            ->whereYear('transaction_time', $year)
            ->whereMonth('transaction_time', $monthNum)
            ->groupBy('date')
            ->get();

        return \view('monthly_report', [
            'year' => $year,
            'month' => $monthName,
            'market_name' => 'Pasar Pusat Jakarta',
            'total_revenue' => $data->sum('revenue'),
            'total_transactions' => $data->sum('count'),
            'compliance_rate' => 100,
            'daily_breakdown' => $data
        ]);
    }

    public function revenueAnalytics()
    {
        // Get hourly revenue for today
        $data = \Illuminate\Support\Facades\DB::table('transactions')
            ->select(\Illuminate\Support\Facades\DB::raw('HOUR(transaction_time) as hour'), \Illuminate\Support\Facades\DB::raw('SUM(amount) as revenue'))
            ->whereDate('transaction_time', \today())
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();

        return \response()->json($data);
    }

    public function forecastVsActual()
    {
        // Actual hourly revenue for today
        $actual = \Illuminate\Support\Facades\DB::table('transactions')
            ->select(\Illuminate\Support\Facades\DB::raw('HOUR(transaction_time) as hour'), \Illuminate\Support\Facades\DB::raw('SUM(amount) as revenue'))
            ->whereDate('transaction_time', \today())
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();

        // Simulated AI Forecast (Actual + Noise for visualization)
        $forecast = [];
        for ($i = 0; $i < 24; $i++) {
            $base = 500000; // Base daily hourly average
            $noise = \rand(-50000, 50000);
            $forecast[] = ['hour' => $i, 'revenue' => $base + $noise];
        }

        return \response()->json([
            'actual' => $actual,
            'forecast' => $forecast
        ]);
    }

    public function mobileNotifications()
    {
        return Notification::where('is_read', false)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
    }

    public function markNotificationRead($id)
    {
        $n = Notification::findOrFail($id);
        $n->update(['is_read' => true]);
        return \response()->json(['status' => 'success']);
    }

    public function verifyPayment($traderId)
    {
        $trader = Trader::findOrFail($traderId);
        $lastPayment = \Illuminate\Support\Facades\DB::table('transactions')
            ->where('trader_id', $traderId)
            ->where('status', 'success')
            ->orderBy('transaction_time', 'desc')
            ->first();

        $isPaid = false;
        if ($lastPayment) {
            // Check if payment is still valid (e.g., within the last 30 days)
            $paidDate = \Carbon\Carbon::parse($lastPayment->transaction_time);
            $isPaid = $paidDate->diffInDays(\now()) < 30;
        }

        return \response()->json([
            'trader' => $trader->name,
            'status' => $isPaid ? 'LUNAS' : 'TUNGGAKAN',
            'last_payment' => $lastPayment ? $lastPayment->transaction_time : 'N/A',
            'is_valid' => $isPaid
        ]);
    }
}
