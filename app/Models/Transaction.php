<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Transaction extends Model {
    use HasUuids;
    protected $fillable = ['local_id', 'market_id', 'slot_id', 'trader_id', 'officer_id', 'device_id', 'amount', 'payment_method', 'transaction_time', 'server_time', 'status', 'receipt_number'];
    protected $casts = ['transaction_time' => 'datetime', 'server_time' => 'datetime'];

    public function market()
    {
        return $this->belongsTo(Market::class);
    }

    public function slot()
    {
        return $this->belongsTo(Slot::class);
    }

    public function trader()
    {
        return $this->belongsTo(Trader::class);
    }
}