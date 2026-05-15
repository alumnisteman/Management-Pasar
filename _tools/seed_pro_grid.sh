#!/bin/bash
php artisan tinker --execute="
\$grid = App\Models\Grid::create(['name' => 'Zona Utama Pasar Ternate', 'description' => 'Area Ring 1 Depan Pasar']);
for (\$i = 1; \$i <= 10; \$i++) {
    App\Models\GridSlot::create(['grid_id' => \$grid->id, 'code' => 'A' . \$i, 'type' => 'permanent', 'status' => 'active']);
    App\Models\GridSlot::create(['grid_id' => \$grid->id, 'code' => 'B' . \$i, 'type' => 'temporary', 'status' => 'active']);
}
"
