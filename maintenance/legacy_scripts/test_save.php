<?php
$trader = \App\Models\Trader::where('name', 'like', 'DJAUHAR%')->first();
if ($trader) {
    $trader->name = "AHMAD TEST";
    $trader->save();
    echo "Saved: " . $trader->name . "\n";
} else {
    echo "Trader not found\n";
}
