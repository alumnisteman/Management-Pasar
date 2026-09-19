<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScanLog extends Model
{
    protected $fillable = [
        'user_id', 'permit_number', 'lat', 'lng', 'scanned_at'
    ];

    protected $casts = [
        'scanned_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
