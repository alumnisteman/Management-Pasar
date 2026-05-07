<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Payment extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'bill_id', 'transaction_id', 'payment_method', 'amount_paid', 'paid_at', 'receipt_url'
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'amount_paid' => 'float'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) $model->id = (string) Str::uuid();
        });
    }

    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }
}
