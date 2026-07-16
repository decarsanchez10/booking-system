<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $roles = collect(['admin', 'agent', 'user'])->mapWithKeys(
            fn (string $role) => [$role => Role::firstOrCreate(['name' => $role])]
        );

        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin User', 'password' => Hash::make('Password123!')]
        );
        $admin->roles()->syncWithoutDetaching([$roles['admin']->id]);

        $agent = User::firstOrCreate(
            ['email' => 'agent@example.com'],
            ['name' => 'Support Agent', 'password' => Hash::make('Password123!')]
        );
        $agent->roles()->syncWithoutDetaching([$roles['agent']->id]);

        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            ['name' => 'Test User', 'password' => Hash::make('Password123!')]
        );
        $user->roles()->syncWithoutDetaching([$roles['user']->id]);
    }
}
