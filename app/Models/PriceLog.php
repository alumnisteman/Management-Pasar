<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PriceLog extends Model
{
    protected $fillable = [
        'commodity_name',
        'price',
        'recorded_at',
        'slot_id'
    ];

    protected $casts = [
        'recorded_at' => 'date',
        'price' => 'float'
    ];

    public function slot()
    {
        return $this->belongsTo(Slot::class);
    }
}
