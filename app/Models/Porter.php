<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Porter
 *
 * @property int $id
 * @property string $name
 * @property string $status
 * @property float $daily_earnings
 * @method static \Illuminate\Database\Eloquent\Builder query()
 * @method static \Illuminate\Database\Eloquent\Builder where($column, $operator = null, $value = null, $boolean = 'and')
 * @method static \Illuminate\Database\Eloquent\Builder orWhere($column, $operator = null, $value = null)
 * @method static \Illuminate\Database\Eloquent\Builder orderBy($column, $direction = 'asc')
 * @method static Porter find($id)
 * @method static Porter create(array $attributes)
 */
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
