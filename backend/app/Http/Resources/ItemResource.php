<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $age = $this->acquisition_date ? (int) abs(now()->diffInYears($this->acquisition_date)) : 0;
        $remaining_age = 5 - $age;
        
        $computed_condition = 'Masih Baik';
        if ($age >= 4 && $age <= 5) {
            $computed_condition = 'Siap Rencana Pengadaan';
        } elseif ($age > 5) {
            $computed_condition = 'Disarankan Ganti';
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'brand_type' => $this->brand_type,
            'code' => $this->code,
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ],
            'location' => [
                'id' => $this->location->id,
                'name' => $this->location->name,
                'building' => $this->location->building,
            ],
            'quantity' => $this->quantity,
            'condition' => $this->condition,
            'condition_label' => match($this->condition) {
                'baik' => 'Baik',
                'rusak_ringan' => 'Rusak Ringan',
                'rusak_berat' => 'Rusak Berat',
                'hilang' => 'Hilang',
                default => $this->condition,
            },
            'serial_number_device' => $this->serial_number_device,
            'procurement_method' => $this->procurement_method,
            'status' => $this->status,
            'acquisition_date' => $this->acquisition_date?->format('Y-m-d'),
            'umur_barang' => $age,
            'sisa_umur_barang' => $remaining_age,
            'kondisi_barang' => $computed_condition,
            'description' => $this->description,
            'image' => $this->image ? '/storage/' . $this->image : null,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
