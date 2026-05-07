import paramiko
import base64

models = {
    "User.php": r"""<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable, HasUuids;
    protected $fillable = ['name', 'email', 'password', 'role', 'market_id', 'device_id', 'is_active', 'last_login_at'];
    protected $hidden = ['password', 'remember_token'];
    protected function casts(): array {
        return ['email_verified_at' => 'datetime', 'password' => 'hashed', 'is_active' => 'boolean', 'last_login_at' => 'datetime'];
    }
}""",
    "Market.php": r"""<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Market extends Model {
    use HasUuids;
    protected $fillable = ['name', 'address', 'latitude', 'longitude', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];
}""",
    "Zone.php": r"""<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Zone extends Model {
    use HasUuids;
    protected $fillable = ['market_id', 'name', 'color'];
}""",
    "Slot.php": r"""<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Slot extends Model {
    use HasUuids;
    protected $fillable = ['market_id', 'zone_id', 'code', 'x_position', 'y_position', 'type', 'status'];
}""",
    "Trader.php": r"""<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Trader extends Model {
    use HasUuids;
    protected $fillable = ['market_id', 'name', 'nik', 'phone', 'type', 'status', 'address'];
}""",
    "Transaction.php": r"""<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Transaction extends Model {
    use HasUuids;
    protected $fillable = ['local_id', 'market_id', 'slot_id', 'trader_id', 'officer_id', 'device_id', 'amount', 'payment_method', 'transaction_time', 'server_time', 'status', 'receipt_number'];
    protected $casts = ['transaction_time' => 'datetime', 'server_time' => 'datetime'];
}""",
    "AuditLog.php": r"""<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class AuditLog extends Model {
    use HasUuids;
    protected $fillable = ['user_id', 'device_id', 'module', 'action', 'payload', 'ip_address'];
    protected $casts = ['payload' => 'json'];
}""",
    "Notification.php": r"""<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Notification extends Model {
    use HasUuids;
    protected $fillable = ['user_id', 'type', 'title', 'message', 'is_read'];
    protected $casts = ['is_read' => 'boolean'];
}""",
    "SyncLog.php": r"""<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class SyncLog extends Model {
    use HasUuids;
    protected $fillable = ['device_id', 'success_count', 'failed_count', 'sync_started_at', 'sync_finished_at'];
}""",
    "Receipt.php": r"""<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Receipt extends Model {
    use HasUuids;
    protected $fillable = ['transaction_id', 'receipt_number', 'printed_at'];
}""",
    "PatrolLog.php": r"""<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class PatrolLog extends Model {
    use HasUuids;
    protected $fillable = ['user_id', 'device_id', 'latitude', 'longitude', 'pinged_at'];
    protected $casts = ['pinged_at' => 'datetime'];
    public function user() { return $this->belongsTo(User::class); }
}""",
    "Permit.php": r"""<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Permit extends Model {
    use HasUuids;
    protected $fillable = ['trader_id', 'slot_id', 'permit_number', 'qr_code_payload', 'issued_at', 'expires_at', 'status', 'is_digital'];
    public function trader() { return $this->belongsTo(Trader::class); }
    public function slot() { return $this->belongsTo(Slot::class); }
}""",
    "Wallet.php": r"""<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Wallet extends Model {
    use HasUuids;
    protected $fillable = ['trader_id', 'balance', 'currency', 'is_frozen'];
}""",
    "WalletTransaction.php": r"""<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class WalletTransaction extends Model {
    use HasUuids;
    protected $fillable = ['wallet_id', 'type', 'amount', 'description', 'reference_id'];
}"""
}

def sync_models(host, user, password):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, username=user, password=password)
        for name, content in models.items():
            encoded = base64.b64encode(content.encode()).decode()
            path = f"/var/www/app/Models/{name}"
            print(f"Uploading {name}...")
            client.exec_command(f"echo '{encoded}' | base64 -d > {path}")
        print("All models synced.")
    finally:
        client.close()

if __name__ == "__main__":
    sync_models("103.175.219.57", "root", "M4ruw4h3@")
