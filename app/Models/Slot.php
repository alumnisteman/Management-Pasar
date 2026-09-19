<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;

class Slot extends Model
{
    use Searchable;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id', 'market_id', 'zone_id', 'code', 'x_position', 'y_position', 'type', 'category', 'status', 'price'];

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

    public function permits()
    {
        return $this->hasMany(Permit::class);
    }

    public function priceLogs()
    {
        return $this->hasMany(PriceLog::class);
    }

    public function trader()
    {
        return $this->hasOneThrough(Trader::class, Permit::class, 'slot_id', 'id', 'id', 'trader_id');
    }
}
