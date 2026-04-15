<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Location;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index(): JsonResponse
    {
        $locations = Location::withCount('items')->orderBy('name')->get();
        return response()->json(['data' => $locations]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'building' => 'nullable|string|max:255',
            'floor' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $location = Location::create($validated);

        ActivityLog::log('create', 'Location', $location->id, null, $location->toArray(), "Menambahkan lokasi: {$location->name}");

        return response()->json([
            'message' => 'Lokasi berhasil ditambahkan',
            'data' => $location,
        ], 201);
    }

    public function show(Location $location): JsonResponse
    {
        return response()->json(['data' => $location->loadCount('items')]);
    }

    public function update(Request $request, Location $location): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'building' => 'nullable|string|max:255',
            'floor' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $oldValues = $location->toArray();
        $location->update($validated);

        ActivityLog::log('update', 'Location', $location->id, $oldValues, $location->fresh()->toArray(), "Mengubah lokasi: {$location->name}");

        return response()->json([
            'message' => 'Lokasi berhasil diperbarui',
            'data' => $location,
        ]);
    }

    public function destroy(Location $location): JsonResponse
    {
        if ($location->items()->count() > 0) {
            return response()->json(['message' => 'Lokasi tidak bisa dihapus karena masih memiliki barang'], 422);
        }

        $oldValues = $location->toArray();
        $location->delete();

        ActivityLog::log('delete', 'Location', $oldValues['id'], $oldValues, null, "Menghapus lokasi: {$oldValues['name']}");

        return response()->json(['message' => 'Lokasi berhasil dihapus']);
    }
}
