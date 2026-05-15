<?php

namespace App\Services;

use App\Models\TemporaryPermit;
use App\Models\TemporaryStall;
use Illuminate\Support\Str;
use Exception;

class TemporaryBookingService
{
    public function book($vendorId, $stallId, $date, $shift)
    {
        // 1. Cek Kapasitas/Kuota Slot
        $count = TemporaryPermit::where([
            'stall_id' => $stallId,
            'date_start' => $date,
            'shift' => $shift,
            'status' => 'active'
        ])->count();

        $stall = TemporaryStall::findOrFail($stallId);
        if ($count >= $stall->capacity) {
            throw new Exception("Slot penuh untuk tanggal dan shift ini.");
        }

        // 2. Anti Double Booking (Satu vendor tidak boleh booking shift yang sama)
        $exists = TemporaryPermit::where([
            'vendor_id' => $vendorId,
            'date_start' => $date,
            'shift' => $shift,
            'status' => 'active'
        ])->exists();

        if ($exists) {
            throw new Exception("Anda sudah memiliki booking aktif di shift ini.");
        }

        // 3. Anti Monopoli (Maksimal 2 slot per hari per pedagang)
        $dailyCount = TemporaryPermit::where('vendor_id', $vendorId)
            ->whereDate('date_start', $date)
            ->where('status', 'active')
            ->count();

        if ($dailyCount >= 2) {
            throw new Exception("Batas maksimal booking adalah 2 slot per hari.");
        }

        // 4. Generate Unique QR Code
        $qr = (string) Str::uuid();

        // 5. Create Permit
        return TemporaryPermit::create([
            'vendor_id' => $vendorId,
            'stall_id' => $stallId,
            'date_start' => $date,
            'date_end' => $date,
            'shift' => $shift,
            'qr_code' => $qr
        ]);
    }
}
