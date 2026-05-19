<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PurchaseOrder extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'trader_id', 'vendor_id', 'total_amount', 'status', 'expected_delivery_date'
    ];

    protected $casts = [
        'total_amount' => 'float',
        'expected_delivery_date' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) $model->id = (string) Str::uuid();
        });
    }

    public function trader() { return $this->belongsTo(Trader::class); }
    public function vendor() { return $this->belongsTo(Vendor::class); }
    public function items() { return $this->hasMany(PurchaseOrderItem::class); }
}
