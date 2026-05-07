<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Zone extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'market_id', 'name', 'description', 'color'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) $model->id = (string) Str::uuid();
        });
    }

    public function market()
    {
        return $this->belongsTo(Market::class);
    }

    public function slots()
    {
        return $this->hasMany(Slot::class);
    }
}
