<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class SyncLog extends Model {
    use HasUuids;
    protected $fillable = ['device_id', 'success_count', 'failed_count', 'sync_started_at', 'sync_finished_at'];
}