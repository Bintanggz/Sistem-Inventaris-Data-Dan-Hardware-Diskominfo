<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'admin', 'display_name' => 'Administrator'],
            ['name' => 'petugas', 'display_name' => 'Petugas'],
            ['name' => 'viewer', 'display_name' => 'Viewer'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role['name']], $role);
        }
    }
}
