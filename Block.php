<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Block extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'market_id', 'zona_id', 'kode_blok', 'name', 'lantai', 'kapasitas'
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
        return $this->belongsTo(Zone::class, 'zona_id');
    }

    public function slots()
    {
        return $this->hasMany(Slot::class, 'block_id');
    }
}
