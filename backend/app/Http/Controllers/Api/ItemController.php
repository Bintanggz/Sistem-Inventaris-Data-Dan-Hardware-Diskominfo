<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ItemResource;
use App\Models\ActivityLog;
use App\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::with(['category', 'location']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        if ($request->filled('condition')) {
            $query->where('condition', $request->condition);
        }

        $items = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 10);

        return ItemResource::collection($items);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'location_id' => 'required|exists:locations,id',
            'quantity' => 'required|integer|min:1',
            'condition' => 'required|in:baik,rusak_ringan,rusak_berat,hilang',
            'acquisition_date' => 'nullable|date',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $validated['code'] = Item::generateCode();

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('items', 'public');
        }

        $item = Item::create($validated);

        ActivityLog::log('create', 'Item', $item->id, null, $item->toArray(), "Menambahkan barang: {$item->name}");

        return response()->json([
            'message' => 'Barang berhasil ditambahkan',
            'data' => new ItemResource($item->load(['category', 'location'])),
        ], 201);
    }

    public function show(Item $item): JsonResponse
    {
        return response()->json([
            'data' => new ItemResource($item->load(['category', 'location'])),
        ]);
    }

    public function update(Request $request, Item $item): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'location_id' => 'required|exists:locations,id',
            'quantity' => 'required|integer|min:1',
            'condition' => 'required|in:baik,rusak_ringan,rusak_berat,hilang',
            'acquisition_date' => 'nullable|date',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $oldValues = $item->toArray();

        if ($request->hasFile('image')) {
            if ($item->image) {
                Storage::disk('public')->delete($item->image);
            }
            $validated['image'] = $request->file('image')->store('items', 'public');
        }

        $item->update($validated);

        ActivityLog::log('update', 'Item', $item->id, $oldValues, $item->fresh()->toArray(), "Mengubah barang: {$item->name}");

        return response()->json([
            'message' => 'Barang berhasil diperbarui',
            'data' => new ItemResource($item->load(['category', 'location'])),
        ]);
    }

    public function destroy(Item $item): JsonResponse
    {
        $oldValues = $item->toArray();

        if ($item->image) {
            Storage::disk('public')->delete($item->image);
        }

        $item->delete();

        ActivityLog::log('delete', 'Item', $oldValues['id'], $oldValues, null, "Menghapus barang: {$oldValues['name']}");

        return response()->json(['message' => 'Barang berhasil dihapus']);
    }
}
