<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditLogger
{
    /**
     * Log a system action.
     * 
     * @param string $action  The action name (e.g., 'GRID_BOOKING')
     * @param mixed $data     The relevant data (will be JSON encoded)
     * @param int|null $userId Explicit user ID (defaults to current Auth user)
     * @param string|null $ip  Explicit IP (defaults to request IP)
     * @param string|null $entity The entity type/ID (e.g., 'Slot:A1')
     */
    public static function log($action, $data = null, $userId = null, $ip = null, $entity = null)
    {
        return AuditLog::create([
            'user_id' => $userId ?? Auth::id(),
            'action' => $action,
            'data' => $data ? json_encode($data) : null,
            'ip_address' => $ip ?? Request::ip(),
        ]);
    }
}
