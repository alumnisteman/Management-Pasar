<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SlotBooking extends Model
{
    protected $fillable = [
        'slot_id', 'vendor_id', 'date', 'shift', 'qr_code', 'status'
    ];

    public function slot()
    {
        return $this->belongsTo(GridSlot::class, 'slot_id');
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}
