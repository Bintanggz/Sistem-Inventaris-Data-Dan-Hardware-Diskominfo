<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    protected $fillable = [
        'name', 'code', 'category_id', 'location_id',
        'quantity', 'condition', 'acquisition_date',
        'description', 'image',
    ];

    protected function casts(): array
    {
        return [
            'acquisition_date' => 'date',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function borrowings(): HasMany
    {
        return $this->hasMany(Borrowing::class);
    }

    public function mutations(): HasMany
    {
        return $this->hasMany(Mutation::class);
    }

    public function maintenances(): HasMany
    {
        return $this->hasMany(Maintenance::class);
    }

    public static function generateCode(): string
    {
        $year = date('Y');
        $lastItem = static::whereYear('created_at', $year)->orderBy('id', 'desc')->first();
        $nextNumber = $lastItem ? (intval(substr($lastItem->code, -5)) + 1) : 1;
        return 'INV-' . $year . '-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }
}
