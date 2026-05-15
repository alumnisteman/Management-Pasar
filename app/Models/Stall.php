<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stall extends Model
{
    protected $fillable = [
        'market_id', 'block_id', 'code', 'lat', 'lng', 'status'
    ];

    public function market()
    {
        return $this->belongsTo(Market::class);
    }

    public function block()
    {
        return $this->belongsTo(Block::class);
    }

    public function traders()
    {
        return $this->hasMany(Trader::class);
    }
}
