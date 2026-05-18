<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SmartMeterReading extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'id', 'slot_id', 'type', 'reading', 'cost', 'recorded_at'
    ];

    protected $casts = [
        'reading' => 'double',
        'cost' => 'decimal:2',
        'recorded_at' => 'datetime'
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) $model->id = (string) Str::uuid();
        });
    }

    public function slot()
    {
        return $this->belongsTo(Slot::class);
    }
}
