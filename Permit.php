<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permit extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'trader_id',
        'slot_id',
        'permit_number',
        'qr_code_payload',
        'issued_at',
        'expires_at',
        'status',
        'is_digital'
    ];

    protected $casts = [
        'issued_at' => 'date',
        'expires_at' => 'date',
        'is_digital' => 'boolean'
    ];

    public function trader()
    {
        return $this->belongsTo(Trader::class);
    }

    public function slot()
    {
        return $this->belongsTo(Slot::class);
    }
}
