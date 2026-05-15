<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Notification extends Model {
    use HasUuids;
    protected $fillable = ['user_id', 'type', 'title', 'message', 'is_read'];
    protected $casts = ['is_read' => 'boolean'];
}