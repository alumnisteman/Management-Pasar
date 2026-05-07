<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TemporaryPermit extends Model
{
    protected $fillable = [
        'vendor_id', 'stall_id', 'date_start', 'date_end', 'shift', 'status', 'qr_code'
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function stall()
    {
        return $this->belongsTo(TemporaryStall::class, 'stall_id');
    }
}
