<?php

namespace App\Services;

use App\Models\Bill;
use App\Models\Vendor;
use Illuminate\Support\Str;

class BillingService
{
    /**
     * Create a new retribution bill for a vendor.
     */
    public function createBill($vendorId, $amount, $description)
    {
        $billNumber = 'INV-' . strtoupper(Str::random(8));

        return Bill::create([
            'vendor_id' => $vendorId,
            'bill_number' => $billNumber,
            'amount' => $amount,
            'description' => $description,
            'status' => 'unpaid',
            'due_date' => now()->addDays(7)
        ]);
    }

    /**
     * Generate automatic bill for a grid booking.
     */
    public function generateBookingBill($booking)
    {
        // Example: 5000 per shift
        $rate = 5000;
        
        return $this->createBill(
            $booking->vendor_id,
            $rate,
            "Retribusi Lapak " . $booking->slot->code . " Tanggal " . $booking->date . " Shift " . $booking->shift
        );
    }
}
