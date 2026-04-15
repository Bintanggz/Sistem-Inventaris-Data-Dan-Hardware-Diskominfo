<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MutationResource extends JsonResource
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
            'from_location' => [
                'id' => $this->fromLocation->id,
                'name' => $this->fromLocation->name,
            ],
            'to_location' => [
                'id' => $this->toLocation->id,
                'name' => $this->toLocation->name,
            ],
            'quantity' => $this->quantity,
            'mutation_date' => $this->mutation_date->format('Y-m-d'),
            'reason' => $this->reason,
            'created_by' => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ],
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
