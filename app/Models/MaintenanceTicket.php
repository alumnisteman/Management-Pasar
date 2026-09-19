<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MaintenanceTicket extends Model
{
    use HasFactory;

    protected $table = 'maintenance_tickets';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'title',
        'description',
        'status',
        'assigned_technician_id',
        'due_date',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public function technician()
    {
        return $this->belongsTo(User::class, 'assigned_technician_id');
    }

    public function workOrders()
    {
        return $this->hasMany(WorkOrder::class);
    }
}
?>
