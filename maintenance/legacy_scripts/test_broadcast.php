<?php
use App\Events\MarketDataUpdated;
broadcast(new MarketDataUpdated('Tes Real-Time Berhasil!', 'success'));
echo "Broadcast sent!\n";
