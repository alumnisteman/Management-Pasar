<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Pelatihan extends Model
{
    use SoftDeletes;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'judul', 'tanggal', 'pemateri', 'kategori', 'lokasi'
    ];

    protected $casts = [
        'tanggal' => 'date'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) $model->id = (string) Str::uuid();
        });
    }

    public function traders()
    {
        return $this->belongsToMany(Trader::class, 'pelatihan_pedagang', 'pelatihan_id', 'trader_id')
                    ->withPivot('status_hadir', 'sertifikat')
                    ->withTimestamps();
    }
}
