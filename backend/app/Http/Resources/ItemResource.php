<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
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
            'acquisition_date' => $this->acquisition_date?->format('Y-m-d'),
            'description' => $this->description,
            'image' => $this->image ? '/storage/' . $this->image : null,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
