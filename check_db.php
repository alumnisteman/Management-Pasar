<?php
$totalSlots = \App\Models\Slot::count();
$totalPermits = \App\Models\Permit::count();
$activePermits = \App\Models\Permit::where('status', 'active')->count();
$permitsWithSlot = \App\Models\Permit::whereNotNull('slot_id')->count();

echo "Slots: $totalSlots\n";
echo "Total Permits: $totalPermits\n";
echo "Active Permits: $activePermits\n";
echo "Permits with slot_id: $permitsWithSlot\n";
