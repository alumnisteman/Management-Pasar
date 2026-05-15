<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Receipt extends Model {
    use HasUuids;
    protected $fillable = ['transaction_id', 'receipt_number', 'printed_at'];
}