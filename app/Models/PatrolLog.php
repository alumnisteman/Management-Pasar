<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * @method static \Illuminate\Database\Eloquent\Builder|PatrolLog query()
 * @method static \Illuminate\Database\Eloquent\Builder|PatrolLog with($relations)
 * @method static \Illuminate\Database\Eloquent\Builder|PatrolLog where($column, $operator = null, $value = null, $boolean = 'and')
 * @method static PatrolLog create(array $attributes = [])
 */
class PatrolLog extends Model {
    use HasUuids;
    protected $fillable = ['user_id', 'device_id', 'latitude', 'longitude', 'pinged_at'];
    protected $casts = ['pinged_at' => 'datetime'];
    
    public function user() { 
        return $this->belongsTo(User::class); 
    }
}