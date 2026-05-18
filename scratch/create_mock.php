<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Transaction;
use App\Models\Market;
use App\Models\Slot;
use App\Models\Trader;
use Illuminate\Support\Str;

try {
    $market = Market::first();
    $slot = Slot::first();
    $trader = Trader::first();
    $user = \App\Models\User::first();

    if (!$market || !$slot || !$trader || !$user) {
        echo "Error: Missing seed data (Market, Slot, Trader, or User is empty)\n";
        exit(1);
    }

    $tx = Transaction::create([
        'id' => (string) Str::uuid(),
        'local_id' => 'LOC-' . strtoupper(Str::random(10)),
        'market_id' => $market->id,
        'slot_id' => $slot->id,
        'trader_id' => $trader->id,
        'officer_id' => $user->id,
        'device_id' => (string) Str::uuid(),
        'amount' => 15000,
        'payment_method' => 'qris',
        'transaction_time' => now(),
        'status' => 'synced'
    ]);

    echo "Mock transaction created successfully!\n";
    echo "Transaction ID: " . $tx->id . "\n";
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
}
