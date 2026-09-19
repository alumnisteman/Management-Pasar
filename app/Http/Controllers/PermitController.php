<?php

namespace App\Http\Controllers;

use App\Models\Permit;
use App\Models\Trader;
use App\Models\Slot;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Events\MarketDataUpdated;

class PermitController extends Controller
{
    /**
     * List all active permits with trader and slot relations.
     */
    public function index()
    {
        $permits = Permit::with(['trader', 'slot.zone'])
            ->where('status', 'active')
            ->orderBy('updated_at', 'desc')
            ->get();
            
        return response()->json($permits);
    }

    public function issue(Request $request)
    {
        $validated = $request->validate([
            'trader_id' => 'required',
            'slot_id' => 'required',
            'shift' => 'required'
        ]);

        $permit = Permit::create([
            'id' => (string) Str::uuid(),
            'trader_id' => $validated['trader_id'],
            'slot_id' => $validated['slot_id'],
            'permit_number' => 'SIPTU-' . date('Ymd') . '-' . strtoupper(Str::random(4)),
            'qr_code_payload' => 'VERIFY-' . Str::random(12),
            'issued_at' => Carbon::now(),
            'expires_at' => Carbon::now()->addYear(),
            'status' => 'active'
        ]);

        try {
            broadcast(new MarketDataUpdated("Izin Baru Terbit: {$permit->permit_number}", 'success'));
        } catch (\Exception $e) {
            \Log::warning("Broadcasting failed: " . $e->getMessage());
        }

        $trader = Trader::find($validated['trader_id']);
        \App\Jobs\SendWhatsAppNotification::dispatch(
            $trader->phone ?? '0800000000', 
            "SIPTU Digital Anda telah diterbitkan. Nomor Izin: {$permit->permit_number}",
            ['permit' => $permit->permit_number]
        );

        return response()->json([
            'status' => 'success',
            'permit_number' => $permit->permit_number,
            'qr_code' => $permit->qr_code_payload
        ]);
    }

    public function export($id)
    {
        $permit = Permit::with(['trader.market', 'slot.zone'])->findOrFail($id);
        $trader = $permit->trader;
        
        $settings = Setting::pluck('value', 'key')->toArray();

        return view('permit_document', [
            'permit_number' => $permit->permit_number,
            'trader_name' => $trader->name,
            'nik' => $trader->nik,
            'market_name' => $trader->market->name ?? 'Pasar Pusat Jakarta',
            'slot_code' => $permit->slot->code,
            'location_type' => strtoupper($trader->location_type ?? 'UMUM'),
            'issued_at' => $permit->issued_at,
            'expires_at' => $permit->expires_at,
            'qr_payload' => $permit->qr_code_payload,
            'header_1' => $settings['permit_header_1'] ?? 'PEMERINTAH KOTA TERNATE',
            'header_2' => $settings['permit_header_2'] ?? 'DINAS PERINDUSTRIAN DAN PERDAGANGAN',
            'location' => $settings['permit_location'] ?? 'MALUKU UTARA',
            'sig_role' => $settings['permit_signatory_role'] ?? 'Kepala Dinas Perindustrian dan Perdagangan',
            'sig_name' => $settings['permit_signatory_name'] ?? 'H. MUHAMMAD ALI, SE, M.Si',
            'sig_nip' => $settings['permit_signatory_nip'] ?? '19720512 199803 1 005',
        ]);
    }

    public function verify($permitNumber)
    {
        // 1. Check in central permits repository (Source of Truth)
        $permit = Permit::with(['trader.market', 'slot.zone'])
            ->where('permit_number', $permitNumber)
            ->first();
            
        if ($permit) {
            return response()->json([
                'status' => true,
                'data' => [
                    'name' => $permit->trader->name,
                    'market' => $permit->trader->market->name ?? 'Pasar Pusat',
                    'stall' => $permit->slot->code ?? 'N/A',
                    'status' => $permit->status,
                    'issued_at' => $permit->issued_at,
                    'expires_at' => $permit->expires_at,
                    'permit_number' => $permit->permit_number
                ]
            ]);
        }

        // 2. Fallback to legacy Traders table for backward compatibility
        $trader = Trader::with(['market', 'stall.zone'])
            ->where('permit_number', $permitNumber)
            ->first();

        if ($trader) {
            return response()->json([
                'status' => true,
                'data' => [
                    'name' => $trader->name,
                    'market' => $trader->market->name ?? 'Pasar Pusat',
                    'stall' => $trader->stall->code ?? 'N/A',
                    'status' => $trader->status,
                    'issued_at' => $trader->tanggal_masuk,
                    'expires_at' => $trader->expired_at,
                    'permit_number' => $trader->permit_number
                ]
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Izin Tidak Ditemukan atau Tidak Valid!'
        ], 404);
    }
}
