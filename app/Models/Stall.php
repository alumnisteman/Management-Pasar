<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Laravel\Scout\Searchable;

class Stall extends Model
{
    use Searchable;

    protected $fillable = [
        'market_id', 'block_id', 'code', 'lat', 'lng', 'status'
    ];

    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'status' => $this->status,
        ];
    }

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
