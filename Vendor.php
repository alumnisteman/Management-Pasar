<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    protected $fillable = [
        'name', 'nik', 'type', 'face_photo_path', 'qr_code', 'violation_score'
    ];

    public function permits()
    {
        return $this->hasMany(Permit::class);
    }

    public function permitRequests()
    {
        return $this->hasMany(PermitRequest::class);
    }
}
