<?php

namespace App\Http\Controllers;

use App\Models\Permit;
use App\Models\Trader;
use App\Models\Slot;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PermitController extends Controller
{
    /**
     * Generate a new digital permit for a trader.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function issue(Request $request)
    {
        /** @var \Illuminate\Http\Request $request */
        $data = $request->validate([
            'trader_id' => 'required|exists:traders,id',
            'slot_id' => 'required|exists:slots,id',
            'expires_at' => 'required|date',
        ]);

        return \Illuminate\Support\Facades\DB::transaction(function () use ($data) {
            $permitNumber = 'PMT-' . \strtoupper(\Illuminate\Support\Str::random(8));
            $qrPayload = "PERMIT|{$permitNumber}|{$data['trader_id']}|{$data['slot_id']}";

            $permit = Permit::create([
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'trader_id' => $data['trader_id'],
                'slot_id' => $data['slot_id'],
                'permit_number' => $permitNumber,
                'qr_code_payload' => $qrPayload,
                'issued_at' => \now(),
                'expires_at' => $data['expires_at'],
                'status' => 'active',
            ]);

            // Update slot status to occupied
            Slot::where('id', $data['slot_id'])->update(['status' => 'occupied']);

            return \response()->json($permit->load(['trader', 'slot']));
        });
    }

    /**
     * Verify a permit QR code.
     * 
     * @param  string  $permitNumber
     * @return \Illuminate\Http\JsonResponse
     */
    public function verify($permitNumber)
    {
        $permit = Permit::with(['trader', 'slot'])->where('permit_number', $permitNumber)->firstOrFail();
        
        return \response()->json([
            'permit_number' => $permit->permit_number,
            'status' => $permit->status,
            'trader' => $permit->trader->name,
            'slot' => $permit->slot->code,
            'issued' => $permit->issued_at,
            'expires' => $permit->expires_at,
            'is_valid' => ($permit->status === 'active' && \now()->lte($permit->expires_at)),
        ]);
    }

    /**
     * Export the permit as a printable document.
     * 
     * @param  int|string  $traderId
     * @return \Illuminate\View\View
     */
    public function export($traderId)
    {
        $trader = Trader::with(['market'])->findOrFail($traderId);
        $permit = Permit::with('slot')
            ->where('trader_id', $traderId)
            ->where('status', 'active')
            ->orderBy('issued_at', 'desc')
            ->firstOrFail();

        $settings = \App\Models\Setting::where('group', 'permit')->get()->pluck('value', 'key');

        return \view('permit_document', [
            'permit_number' => $permit->permit_number,
            'trader_name' => $trader->name,
            'nik' => $trader->nik,
            'market_name' => $trader->market->name ?? 'Pasar Pusat Jakarta',
            'slot_code' => $permit->slot->code,
            'location_type' => \strtoupper($trader->location_type ?? 'UMUM'),
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
}
