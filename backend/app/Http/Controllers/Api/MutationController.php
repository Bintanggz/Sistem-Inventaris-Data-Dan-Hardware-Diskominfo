<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MutationResource;
use App\Models\ActivityLog;
use App\Models\Item;
use App\Models\Mutation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MutationController extends Controller
{
    public function index(Request $request)
    {
        $query = Mutation::with(['item', 'fromLocation', 'toLocation', 'creator']);

        if ($request->filled('item_id')) {
            $query->where('item_id', $request->item_id);
        }

        $mutations = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 10);

        return MutationResource::collection($mutations);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'to_location_id' => 'required|exists:locations,id',
            'quantity' => 'required|integer|min:1',
            'mutation_date' => 'required|date',
            'reason' => 'nullable|string',
        ]);

        $item = Item::findOrFail($validated['item_id']);

        if ($validated['to_location_id'] == $item->location_id) {
            return response()->json(['message' => 'Lokasi tujuan harus berbeda dari lokasi saat ini'], 422);
        }

        $validated['from_location_id'] = $item->location_id;
        $validated['created_by'] = $request->user()->id;

        $mutation = Mutation::create($validated);

        // Update item location
        $item->update(['location_id' => $validated['to_location_id']]);

        ActivityLog::log('create', 'Mutation', $mutation->id, null, $mutation->toArray(), "Mutasi barang: {$item->name} dari {$mutation->fromLocation->name} ke {$mutation->toLocation->name}");

        return response()->json([
            'message' => 'Mutasi barang berhasil dicatat',
            'data' => new MutationResource($mutation->load(['item', 'fromLocation', 'toLocation', 'creator'])),
        ], 201);
    }
}
