<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'customer_id', 'trader_id', 'total_amount', 'status', 'shipping_address', 'payment_method'
    ];

    protected $casts = [
        'total_amount' => 'float',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) $model->id = (string) Str::uuid();
        });
    }

    public function customer() { return $this->belongsTo(Customer::class); }
    public function trader() { return $this->belongsTo(Trader::class); }
    public function items() { return $this->hasMany(OrderItem::class); }
}
