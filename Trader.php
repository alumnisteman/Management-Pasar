<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;

class Trader extends Model
{
    use Searchable;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'market_id', 'stall_id', 'name', 'nik', 'permit_number', 
        'status', 'arrears', 'expired_at', 'phone', 'type', 'scale', 
        'location_type', 'reputation_score'
    ];

    protected $casts = [
        'expired_at' => 'date',
        'arrears' => 'decimal:2',
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

    public function stall()
    {
        return $this->belongsTo(Stall::class);
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    public function permits()
    {
        return $this->hasMany(Permit::class);
    }
}
