<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermitRequest extends Model
{
    protected $fillable = [
        'vendor_id', 'stall_id', 'type', 'status'
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function stall()
    {
        return $this->belongsTo(Stall::class);
    }
}
