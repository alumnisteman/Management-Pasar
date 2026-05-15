<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class WalletTransaction extends Model {
    use HasUuids;
    protected $fillable = ['wallet_id', 'type', 'amount', 'description', 'reference_id'];
}