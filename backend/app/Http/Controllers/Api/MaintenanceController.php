<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MaintenanceResource;
use App\Models\ActivityLog;
use App\Models\Maintenance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MaintenanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Maintenance::with('item');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->whereHas('item', fn($q) => $q->where('name', 'like', "%{$request->search}%"));
        }

        $maintenances = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 10);

        return MaintenanceResource::collection($maintenances);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'status' => 'required|in:pending,in_progress,selesai,dibatalkan',
            'cost' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'technician' => 'nullable|string|max:255',
        ]);

        $maintenance = Maintenance::create($validated);

        ActivityLog::log('create', 'Maintenance', $maintenance->id, null, $maintenance->toArray(), "Menambahkan pemeliharaan untuk: {$maintenance->item->name}");

        return response()->json([
            'message' => 'Data pemeliharaan berhasil ditambahkan',
            'data' => new MaintenanceResource($maintenance->load('item')),
        ], 201);
    }

    public function update(Request $request, Maintenance $maintenance): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,selesai,dibatalkan',
            'end_date' => 'nullable|date',
            'cost' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'technician' => 'nullable|string|max:255',
        ]);

        $oldValues = $maintenance->toArray();
        $maintenance->update($validated);

        ActivityLog::log('update', 'Maintenance', $maintenance->id, $oldValues, $maintenance->fresh()->toArray(), "Mengubah status pemeliharaan: {$maintenance->item->name}");

        return response()->json([
            'message' => 'Data pemeliharaan berhasil diperbarui',
            'data' => new MaintenanceResource($maintenance->load('item')),
        ]);
    }
}
