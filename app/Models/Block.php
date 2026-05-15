<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Block extends Model
{
    protected $fillable = ['market_id', 'name'];

    public function market()
    {
        return $this->belongsTo(Market::class);
    }

    public function stalls()
    {
        return $this->hasMany(Stall::class);
    }
}
