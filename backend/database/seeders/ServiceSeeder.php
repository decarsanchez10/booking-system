<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's services.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'Hardware',
                'description' => 'Physical device repair, screen replacements, component issues',
                'category' => 'Hardware',
                'price' => 0.00,
                'estimated_duration' => 30,
                'priority_level' => 'Normal',
                'is_active' => true,
            ],
            [
                'name' => 'Software',
                'description' => 'OS updates, app installations, malware removal',
                'category' => 'Software',
                'price' => 0.00,
                'estimated_duration' => 30,
                'priority_level' => 'Normal',
                'is_active' => true,
            ],
            [
                'name' => 'Network',
                'description' => 'Wi-Fi setup, VPN, firewall configuration',
                'category' => 'Network',
                'price' => 0.00,
                'estimated_duration' => 30,
                'priority_level' => 'Normal',
                'is_active' => true,
            ],
            [
                'name' => 'Account Access',
                'description' => 'Password resets, login issues, permissions',
                'category' => 'Account',
                'price' => 0.00,
                'estimated_duration' => 15,
                'priority_level' => 'Normal',
                'is_active' => true,
            ],
            [
                'name' => 'Data Recovery',
                'description' => 'File recovery, backup setup, data migration',
                'category' => 'Data',
                'price' => 0.00,
                'estimated_duration' => 45,
                'priority_level' => 'High',
                'is_active' => true,
            ],
            [
                'name' => 'Security',
                'description' => 'Antivirus, threat detection, security audits',
                'category' => 'Security',
                'price' => 0.00,
                'estimated_duration' => 30,
                'priority_level' => 'High',
                'is_active' => true,
            ],
            [
                'name' => 'Email',
                'description' => 'Email configuration, spam filtering, account setup',
                'category' => 'Email',
                'price' => 0.00,
                'estimated_duration' => 20,
                'priority_level' => 'Normal',
                'is_active' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::firstOrCreate(
                ['name' => $service['name']],
                $service
            );
        }
    }
}
