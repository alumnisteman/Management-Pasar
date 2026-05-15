<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    protected $fillable = ['vendor_id', 'bill_number', 'amount', 'description', 'status', 'due_date'];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
