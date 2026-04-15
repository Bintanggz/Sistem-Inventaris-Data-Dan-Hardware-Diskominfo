<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BorrowingResource extends JsonResource
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
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'borrower_name' => $this->borrower_name,
            'quantity' => $this->quantity,
            'borrow_date' => $this->borrow_date->format('Y-m-d'),
            'due_date' => $this->due_date->format('Y-m-d'),
            'return_date' => $this->return_date?->format('Y-m-d'),
            'status' => $this->status,
            'status_label' => match($this->status) {
                'dipinjam' => 'Dipinjam',
                'dikembalikan' => 'Dikembalikan',
                'terlambat' => 'Terlambat',
                default => $this->status,
            },
            'notes' => $this->notes,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
