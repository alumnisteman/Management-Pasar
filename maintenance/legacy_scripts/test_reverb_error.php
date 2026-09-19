<?php
try {
    $trader = \App\Models\Trader::first();
    broadcast(new \App\Events\MarketDataUpdated("Test manual", "info"));
    echo "Broadcast logic executed\n";
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
