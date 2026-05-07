<?php

namespace App\Services;

use App\Models\SlotBooking;
use App\Models\GridSlot;
use App\Models\Slot;
use App\Models\PriceLog;
use Illuminate\Support\Str;
use Exception;

class GridBookingService
{
    public function book($vendorId, $slotId, $date, $shift)
    {
        // 1. Cek apakah slot sudah terisi di hari dan shift tersebut
        $exists = SlotBooking::where([
            'slot_id' => $slotId,
            'date' => $date,
            'shift' => $shift,
            'status' => 'active'
        ])->exists();

        if ($exists) {
            throw new Exception("Slot ini sudah terisi untuk jadwal tersebut.");
        }

        // 2. Anti Double Booking (Satu vendor tidak boleh punya 2 slot di shift yang sama)
        $vendorExists = SlotBooking::where([
            'vendor_id' => $vendorId,
            'date' => $date,
            'shift' => $shift,
            'status' => 'active'
        ])->exists();

        if ($vendorExists) {
            throw new Exception("Anda sudah memiliki slot aktif di shift ini.");
        }

        // 3. Anti Monopoli (Maksimal 2 slot per hari per pedagang)
        $dailyCount = SlotBooking::where('vendor_id', $vendorId)
            ->whereDate('date', $date)
            ->where('status', 'active')
            ->count();

        if ($dailyCount >= 2) {
            throw new Exception("Batas maksimal adalah 2 slot per hari.");
        }

        // 4. Create Booking
        $booking = SlotBooking::create([
            'slot_id' => $slotId,
            'vendor_id' => $vendorId,
            'date' => $date,
            'shift' => $shift,
            'qr_code' => (string) Str::uuid(),
            'status' => 'active'
        ]);

        // 5. Dynamic pricing calculation
        $totalSlots = Slot::count();
        $occupiedSlots = Slot::where('status', 'occupied')->count();
        $occupancy = $totalSlots > 0 ? ($occupiedSlots / $totalSlots) * 100 : 0;
        $basePrice = 50000;
        $multiplier = 1.0;
        if ($occupancy > 90) $multiplier = 1.3;
        elseif ($occupancy > 75) $multiplier = 1.15;
        elseif ($occupancy < 30) $multiplier = 0.85;
        $dynamicPrice = round($basePrice * $multiplier);

        // 6. Update slot price and log
        $slot = Slot::find($slotId);
        if ($slot) {
            $slot->price = $dynamicPrice;
            $slot->save();
            PriceLog::create([
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'slot_id' => $slotId,
                'price' => $dynamicPrice
            ]);
        }

        return $booking;
}
