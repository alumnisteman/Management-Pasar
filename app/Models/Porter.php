<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Porter extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'id_number', 'phone', 'status', 'rating', 'daily_earnings', 'daily_target'
    ];

    public function jobs()
    {
        return $this->hasMany(PorterJob::class);
    }

    public function incentives()
    {
        return $this->hasMany(PorterIncentive::class);
    }
}
