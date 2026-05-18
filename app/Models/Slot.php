<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

use Laravel\Scout\Searchable;

class Slot extends Model
{
    use Searchable;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id', 'code', 'category', 'zone_id', 'x_position', 'y_position', 'status', 'price'];

    public static function boot(): void
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) $model->id = (string) Str::uuid();
        });
    }
    public function priceLogs()
    {
        return $this->hasMany(PriceLog::class);
    }
    public function smartMeterReadings()
    {
        return $this->hasMany(SmartMeterReading::class);
    }
}
