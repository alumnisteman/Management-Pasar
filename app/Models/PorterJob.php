<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PorterJob extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'porter_id', 'customer_name', 'location_from', 'location_to', 
        'weight_category', 'fee', 'status', 'rating', 'feedback'
    ];

    public function porter()
    {
        return $this->belongsTo(Porter::class);
    }
}
