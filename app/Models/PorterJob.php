<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @method static \Illuminate\Database\Eloquent\Builder|PorterJob query()
 * @method static \Illuminate\Database\Eloquent\Builder|PorterJob where($column, $operator = null, $value = null, $boolean = 'and')
 * @method static \Illuminate\Database\Eloquent\Builder|PorterJob whereBetween($column, array $values, $boolean = 'and', $not = false)
 * @method static PorterJob|null find($id, $columns = ['*'])
 * @method static PorterJob create(array $attributes = [])
 */
class PorterJob extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'porter_id', 'customer_name', 'location_from', 'location_to', 
        'weight_category', 'fee', 'status', 'rating', 'feedback'
    ];

    public function porter()
    {
        return $this->belongsTo(Porter::class);
    }
}
