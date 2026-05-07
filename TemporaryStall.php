<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TemporaryStall extends Model
{
    protected $fillable = [
        'code', 'name', 'zone_id', 'area_name', 'latitude', 'longitude', 'capacity', 'active_dates'
    ];

    protected $casts = [
        'active_dates' => 'array'
    ];

    public function permits()
    {
        return $this->hasMany(TemporaryPermit::class, 'stall_id');
    }
}
