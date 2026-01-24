<?php

namespace Database\Seeders;

use App\Models\Beneficiary;
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
        $ahmed = User::updateOrCreate(
            ['email' => 'ahmed@pay.com'],
            [
                'name' => 'Ahmed Ali',
                'phone' => '0500000001',
                'national_id' => '1010101010',
                'dob' => '1995-05-20',
                'password' => Hash::make('password'),
            ]
        );

        $sara = User::updateOrCreate(
            ['email' => 'sara@pay.com'],
            [
                'name' => 'Sara Moh',
                'phone' => '0500000002',
                'national_id' => '1020202020',
                'dob' => '1998-10-15',
                'password' => Hash::make('password'),
            ]
        );

        Beneficiary::firstOrCreate([
            'user_id' => $ahmed->id,
            'beneficiary_user_id' => $sara->id,
        ], [
            'alias_name' => 'Sara'
        ]);

        Beneficiary::firstOrCreate([
            'user_id' => $sara->id,
            'beneficiary_user_id' => $ahmed->id,
        ], [
            'alias_name' => 'Ahmed'
        ]);


        $this->command->info('Creating 500 realistic users... please wait ');

        User::factory(500)->create();

        $this->command->info('Done! 500 Users created with IBANs & Balances ');
    }

}
