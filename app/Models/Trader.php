<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

/**
 * App\Models\Trader
 *
 * @property string $id
 * @property string $name
 * @property string $nik
 * @property string|null $phone
 * @property string $type
 * @property string $status
 * @property string $scale
 * @property string $location_type
 * @property int $reputation_score
 * @property float|null $arrears
 * @property string|null $last_payment
 * @property float $wallet_balance
 * @property-read \App\Models\Wallet|null $wallet
 * @method static \Illuminate\Database\Eloquent\Builder query()
 * @method static \Illuminate\Database\Eloquent\Builder where($column, $operator = null, $value = null, $boolean = 'and')
 * @method static Trader find($id)
 * @method static Trader create(array $attributes)
 */
class Trader extends Model
{
    use SoftDeletes, Searchable;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'name', 'nik', 'phone', 'type', 'status', 'scale', 
        'location_type', 'reputation_score', 'arrears', 'last_payment'
    ];

    public function permits()
    {
        return $this->hasMany(Permit::class);
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    public function toSearchableArray()
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'nik'            => $this->nik,
            'phone'          => $this->phone,
            'type'           => $this->type,
            'status'         => $this->status,
            'scale'          => $this->scale,
            'location_type'  => $this->location_type,
            'reputation_score' => $this->reputation_score,
        ];
    }
}
