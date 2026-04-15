<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaintenanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'item' => [
                'id' => $this->item->id,
                'name' => $this->item->name,
                'code' => $this->item->code,
            ],
            'start_date' => $this->start_date->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'status' => $this->status,
            'status_label' => match($this->status) {
                'pending' => 'Menunggu',
                'in_progress' => 'Dalam Perbaikan',
                'selesai' => 'Selesai',
                'dibatalkan' => 'Dibatalkan',
                default => $this->status,
            },
            'cost' => $this->cost,
            'description' => $this->description,
            'technician' => $this->technician,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
