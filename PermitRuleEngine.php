<?php

namespace App\Services;

use App\Models\Permit;
use App\Models\Stall;
use Exception;

class PermitRuleEngine
{
    /**
     * Hard rule: No transfers allowed.
     */
    public function canTransfer($permit)
    {
        return false;
    }

    /**
     * Business logic for assigning a permit.
     */
    public function assignPermit($vendor_id, $stall_id, $duration_months = 6)
    {
        // 1. Check if stall exists and is available
        $stall = Stall::findOrFail($stall_id);
        if ($stall->status !== 'available') {
            throw new Exception("Lapak sedang tidak tersedia atau sudah terisi.");
        }

        // 2. Double check if there is any active permit for this stall
        if (Permit::where('stall_id', $stall_id)->where('status', 'active')->exists()) {
            throw new Exception("Lapak sudah terisi oleh izin aktif lainnya.");
        }

        // 3. Check if vendor already has an active permit
        if (Permit::where('vendor_id', $vendor_id)->where('status', 'active')->exists()) {
            throw new Exception("Pedagang sudah memiliki izin aktif di lapak lain.");
        }

        // 4. Create new permit
        $permit = Permit::create([
            'vendor_id' => $vendor_id,
            'stall_id' => $stall_id,
            'start_date' => now(),
            'end_date' => now()->addMonths($duration_months),
            'status' => 'active',
            'non_transferable' => true
        ]);

        // 5. Update stall status
        $stall->update(['status' => 'occupied']);

        return $permit;
    }

    /**
     * Automatic revocation logic based on violation score.
     */
    public function checkAndRevoke($vendor)
    {
        if ($vendor->violation_score >= 80) {
            $activePermits = Permit::where('vendor_id', $vendor->id)->where('status', 'active')->get();
            foreach ($activePermits as $permit) {
                $permit->update(['status' => 'revoked']);
                $permit->stall->update(['status' => 'available']);
                
                AuditLogger::log('PERMIT_REVOKED', [
                    'vendor_id' => $vendor->id,
                    'permit_id' => $permit->id,
                    'reason' => 'Indikasi pelanggaran berat / skor > 80'
                ]);
            }
            return true;
        }
        return false;
    }
}
