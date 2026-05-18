<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'trader_id', 'slot_id', 'amount', 'due_date', 'status'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) \Illuminate\Support\Str::uuid();
            }
        });
    }

    public function trader()
    {
        return $this->belongsTo(Trader::class);
    }

    public function slot()
    {
        return $this->belongsTo(Slot::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
