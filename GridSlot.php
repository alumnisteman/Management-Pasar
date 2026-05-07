<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GridSlot extends Model
{
    protected $fillable = ['grid_id', 'code', 'type', 'status', 'latitude', 'longitude'];

    public function grid()
    {
        return $this->belongsTo(Grid::class);
    }

    public function bookings()
    {
        return $this->hasMany(SlotBooking::class, 'slot_id');
    }
}
