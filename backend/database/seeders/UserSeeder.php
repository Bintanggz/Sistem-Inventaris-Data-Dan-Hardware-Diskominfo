<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();
        $petugasRole = Role::where('name', 'petugas')->first();
        $viewerRole = Role::where('name', 'viewer')->first();

        User::firstOrCreate(
            ['email' => 'admin@siindah.go.id'],
            [
                'name' => 'Administrator',
                'password' => bcrypt('password'),
                'role_id' => $adminRole->id,
            ]
        );

        User::firstOrCreate(
            ['email' => 'petugas@siindah.go.id'],
            [
                'name' => 'Petugas Inventaris',
                'password' => bcrypt('password'),
                'role_id' => $petugasRole->id,
            ]
        );

        User::firstOrCreate(
            ['email' => 'viewer@siindah.go.id'],
            [
                'name' => 'Viewer',
                'password' => bcrypt('password'),
                'role_id' => $viewerRole->id,
            ]
        );
    }
}
