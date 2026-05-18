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

    if (!$market || !$slot || !$trader) {
        echo "Error: Missing seed data (Market, Slot, or Trader is empty)\n";
        exit(1);
    }

    $tx = Transaction::create([
        'id' => (string) Str::uuid(),
        'market_id' => $market->id,
        'slot_id' => $slot->id,
        'trader_id' => $trader->id,
        'amount' => 15000,
        'payment_method' => 'qris',
        'transaction_time' => now(),
        'status' => 'success'
    ]);

    echo "Mock transaction created successfully!\n";
    echo "Transaction ID: " . $tx->id . "\n";
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
}
