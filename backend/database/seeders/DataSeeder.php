<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Location;
use App\Models\Item;
use Illuminate\Database\Seeder;

class DataSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Komputer & Laptop', 'description' => 'Perangkat komputer, laptop, dan aksesorisnya'],
            ['name' => 'Mebel', 'description' => 'Meja, kursi, lemari, dan perabot kantor'],
            ['name' => 'Elektronik', 'description' => 'Peralatan elektronik seperti AC, printer, proyektor'],
            ['name' => 'Kendaraan', 'description' => 'Kendaraan dinas roda dua dan roda empat'],
            ['name' => 'Alat Tulis Kantor', 'description' => 'Perlengkapan alat tulis dan kantor'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['name' => $cat['name']], $cat);
        }

        $locations = [
            ['name' => 'Ruang Server', 'building' => 'Gedung A', 'floor' => 'Lantai 1'],
            ['name' => 'Ruang Kepala', 'building' => 'Gedung A', 'floor' => 'Lantai 2'],
            ['name' => 'Ruang Staff', 'building' => 'Gedung A', 'floor' => 'Lantai 1'],
            ['name' => 'Ruang Rapat', 'building' => 'Gedung B', 'floor' => 'Lantai 1'],
            ['name' => 'Gudang', 'building' => 'Gedung C', 'floor' => 'Lantai 1'],
        ];

        foreach ($locations as $loc) {
            Location::firstOrCreate(['name' => $loc['name']], $loc);
        }

        $komputer = Category::where('name', 'Komputer & Laptop')->first();
        $mebel = Category::where('name', 'Mebel')->first();
        $elektronik = Category::where('name', 'Elektronik')->first();
        $server = Location::where('name', 'Ruang Server')->first();
        $staff = Location::where('name', 'Ruang Staff')->first();
        $rapat = Location::where('name', 'Ruang Rapat')->first();

        $items = [
            ['name' => 'Laptop ASUS VivoBook', 'code' => 'INV-2026-00001', 'category_id' => $komputer->id, 'location_id' => $staff->id, 'quantity' => 5, 'condition' => 'baik', 'acquisition_date' => '2024-03-15', 'description' => 'Laptop untuk staff kantor'],
            ['name' => 'PC Server Dell PowerEdge', 'code' => 'INV-2026-00002', 'category_id' => $komputer->id, 'location_id' => $server->id, 'quantity' => 2, 'condition' => 'baik', 'acquisition_date' => '2024-01-10', 'description' => 'Server utama data center'],
            ['name' => 'Meja Kerja Staff', 'code' => 'INV-2026-00003', 'category_id' => $mebel->id, 'location_id' => $staff->id, 'quantity' => 10, 'condition' => 'baik', 'acquisition_date' => '2023-06-20'],
            ['name' => 'Kursi Ergonomis', 'code' => 'INV-2026-00004', 'category_id' => $mebel->id, 'location_id' => $staff->id, 'quantity' => 10, 'condition' => 'rusak_ringan', 'acquisition_date' => '2023-06-20'],
            ['name' => 'Proyektor Epson', 'code' => 'INV-2026-00005', 'category_id' => $elektronik->id, 'location_id' => $rapat->id, 'quantity' => 3, 'condition' => 'baik', 'acquisition_date' => '2024-02-28', 'description' => 'Proyektor untuk ruang rapat'],
            ['name' => 'Printer HP LaserJet', 'code' => 'INV-2026-00006', 'category_id' => $elektronik->id, 'location_id' => $staff->id, 'quantity' => 2, 'condition' => 'rusak_berat', 'acquisition_date' => '2022-11-05'],
        ];

        foreach ($items as $item) {
            Item::firstOrCreate(['code' => $item['code']], $item);
        }
    }
}
