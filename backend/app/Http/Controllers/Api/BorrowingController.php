<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BorrowingResource;
use App\Models\ActivityLog;
use App\Models\Borrowing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BorrowingController extends Controller
{
    public function index(Request $request)
    {
        $query = Borrowing::with(['item', 'user']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('borrower_name', 'like', "%{$search}%")
                  ->orWhereHas('item', fn($q2) => $q2->where('name', 'like', "%{$search}%"));
            });
        }

        $borrowings = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 10);

        return BorrowingResource::collection($borrowings);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'borrower_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'borrow_date' => 'required|date',
            'due_date' => 'required|date|after:borrow_date',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'dipinjam';

        $borrowing = Borrowing::create($validated);

        ActivityLog::log('create', 'Borrowing', $borrowing->id, null, $borrowing->toArray(), "Peminjaman barang: {$borrowing->item->name} oleh {$borrowing->borrower_name}");

        return response()->json([
            'message' => 'Peminjaman berhasil dicatat',
            'data' => new BorrowingResource($borrowing->load(['item', 'user'])),
        ], 201);
    }

    public function returnItem(Request $request, Borrowing $borrowing): JsonResponse
    {
        if ($borrowing->status === 'dikembalikan') {
            return response()->json(['message' => 'Barang sudah dikembalikan sebelumnya'], 422);
        }

        $oldValues = $borrowing->toArray();
        $borrowing->update([
            'return_date' => now()->toDateString(),
            'status' => 'dikembalikan',
        ]);

        ActivityLog::log('update', 'Borrowing', $borrowing->id, $oldValues, $borrowing->fresh()->toArray(), "Pengembalian barang: {$borrowing->item->name} oleh {$borrowing->borrower_name}");

        return response()->json([
            'message' => 'Barang berhasil dikembalikan',
            'data' => new BorrowingResource($borrowing->load(['item', 'user'])),
        ]);
    }
}
