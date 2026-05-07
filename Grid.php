<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grid extends Model
{
    protected $fillable = ['name', 'description'];

    public function slots()
    {
        return $this->hasMany(GridSlot::class);
    }
}
