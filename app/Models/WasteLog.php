<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class WasteLog extends Model
{
    use SoftDeletes;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'market_id', 'zone_id', 'trader_id', 'slot_id', 
        'volume_kg', 'type', 'status', 'collected_at'
    ];

    protected $casts = [
        'collected_at' => 'datetime',
        'volume_kg' => 'float',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) $model->id = (string) Str::uuid();
        });
    }

    public function market() { return $this->belongsTo(Market::class); }
    public function zone() { return $this->belongsTo(Zone::class); }
    public function trader() { return $this->belongsTo(Trader::class); }
    public function slot() { return $this->belongsTo(Slot::class); }
}
