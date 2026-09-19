<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditLogger
{
    /**
     * Log a system action.
     */
    public static function log($action, $data = null, $userId = null, $ip = null, $entity = null)
    {
        return AuditLog::create([
            'user_id' => $userId ?? Auth::id(),
            'action' => $action,
            'module' => $entity ?? 'SYSTEM',
            'data' => $data ? json_encode($data) : null,
            'ip_address' => $ip ?? Request::ip(),
        ]);
    }
}
