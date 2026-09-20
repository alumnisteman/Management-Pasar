<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PorterIncentive extends Model
{
    protected $fillable = [
        'porter_id', 'week_start', 'week_end', 'jobs_completed', 
        'avg_rating', 'total_earnings', 'days_hit_target', 'tier', 
        'bonus_amount', 'status'
    ];

    public function porter()
    {
        return $this->belongsTo(Porter::class);
    }
}
