<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define default roles
        $roles = [
            ['name' => 'admin', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'operator lapangan', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'orang pajak', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'dinas terkait', 'created_at' => now(), 'updated_at' => now()],
        ];

        // Insert roles if they do not exist
        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(['name' => $role['name']], $role);
        }

        // Define a minimal set of permissions (can be expanded later)
        $permissions = [
            ['name' => 'view_reports', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'manage_stalls', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'manage_users', 'created_at' => now(), 'updated_at' => now()],
        ];

        foreach ($permissions as $perm) {
            DB::table('permissions')->updateOrInsert(['name' => $perm['name']], $perm);
        }

        // Assign all permissions to admin role (example)
        $adminRoleId = DB::table('roles')->where('name', 'admin')->value('id');
        if ($adminRoleId) {
            foreach ($permissions as $perm) {
                $permId = DB::table('permissions')->where('name', $perm['name'])->value('id');
                DB::table('role_permission')->updateOrInsert([
                    'role_id' => $adminRoleId,
                    'permission_id' => $permId,
                ]);
            }
        }
    }
}
?>
