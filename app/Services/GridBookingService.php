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
        return \Illuminate\Support\Facades\DB::transaction(function () use ($vendorId, $slotId, $date, $shift) {
            // 1. Lock the slot for update to prevent simultaneous bookings
            $slot = Slot::where('id', $slotId)->lockForUpdate()->first();
            
            if (!$slot) {
                throw new Exception("Slot tidak ditemukan.");
            }

            // 2. Cek apakah slot sudah terisi di hari dan shift tersebut
            $exists = SlotBooking::where([
                'slot_id' => $slotId,
                'date' => $date,
                'shift' => $shift,
                'status' => 'active'
            ])->exists();

            if ($exists) {
                throw new Exception("Slot ini sudah terisi untuk jadwal tersebut.");
            }

            // 3. Anti Double Booking (Satu vendor tidak boleh punya 2 slot di shift yang sama)
            $vendorExists = SlotBooking::where([
                'vendor_id' => $vendorId,
                'date' => $date,
                'shift' => $shift,
                'status' => 'active'
            ])->exists();

            if ($vendorExists) {
                throw new Exception("Anda sudah memiliki slot aktif di shift ini.");
            }

            // 4. Anti Monopoli (Maksimal 2 slot per hari per pedagang)
            $dailyCount = SlotBooking::where('vendor_id', $vendorId)
                ->whereDate('date', $date)
                ->where('status', 'active')
                ->count();

            if ($dailyCount >= 2) {
                throw new Exception("Batas maksimal adalah 2 slot per hari.");
            }

            // 5. Create Booking
            $booking = SlotBooking::create([
                'slot_id' => $slotId,
                'vendor_id' => $vendorId,
                'date' => $date,
                'shift' => $shift,
                'qr_code' => (string) Str::uuid(),
                'status' => 'active'
            ]);

            // 6. Dynamic pricing calculation
            $totalSlots = Slot::count();
            $occupiedSlots = SlotBooking::where([
                'date' => $date,
                'shift' => $shift,
                'status' => 'active'
            ])->count();
            
            $occupancy = $totalSlots > 0 ? ($occupiedSlots / $totalSlots) * 100 : 0;
            $basePrice = 50000;
            $multiplier = 1.0;
            
            if ($occupancy > 90) $multiplier = 1.3;
            else if ($occupancy > 75) $multiplier = 1.15;
            else if ($occupancy < 30) $multiplier = 0.85;
            
            $dynamicPrice = round($basePrice * $multiplier);

            // Gamification Tier Discount
            $vendor = \App\Models\Trader::find($vendorId);
            if ($vendor && $vendor->reputation_score >= 86) {
                // Platinum Tier gets 10% discount automatically
                $dynamicPrice = round($dynamicPrice * 0.90);
                
                \App\Services\AuditLogger::log('GAMIFICATION_REWARD', [
                    'vendor_id' => $vendorId,
                    'reward'    => 'Platinum Discount 10% on Booking',
                    'original'  => round($basePrice * $multiplier),
                    'discounted'=> $dynamicPrice
                ]);
            }

            // 7. Update slot price and log
            $slot->price = $dynamicPrice;
            $slot->save();

            PriceLog::create([
                'id' => (string) Str::uuid(),
                'slot_id' => $slotId,
                'price' => $dynamicPrice
            ]);

            return $booking;
        });
    }
}
