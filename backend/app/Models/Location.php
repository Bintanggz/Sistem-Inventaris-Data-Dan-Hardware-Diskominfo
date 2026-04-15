<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    protected $fillable = ['name', 'building', 'floor', 'description'];

    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }

    public function mutationsFrom(): HasMany
    {
        return $this->hasMany(Mutation::class, 'from_location_id');
    }

    public function mutationsTo(): HasMany
    {
        return $this->hasMany(Mutation::class, 'to_location_id');
    }
}
