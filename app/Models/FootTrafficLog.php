<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class FootTrafficLog extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'id', 'zone_id', 'crowd_count', 'recorded_at'
    ];

    protected $casts = [
        'crowd_count' => 'integer',
        'recorded_at' => 'datetime'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) $model->id = (string) Str::uuid();
        });
    }

    public function zone()
    {
        return $this->belongsTo(Zone::class);
    }
}
