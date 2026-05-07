<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Market extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'address',
        'latitude',
        'longitude',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) $model->id = (string) Str::uuid();
        });
    }

    public function zones()
    {
        return $this->hasMany(Zone::class);
    }

    public function slots()
    {
        return $this->hasMany(Slot::class);
    }

    public function traders()
    {
        return $this->hasMany(Trader::class);
    }
}
