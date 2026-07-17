<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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

        $this->call(ServiceSeeder::class);
    }
}
