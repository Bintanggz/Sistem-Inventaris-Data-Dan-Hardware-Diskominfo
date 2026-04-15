<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount('items')->orderBy('name')->get();
        return response()->json(['data' => $categories]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($validated);

        ActivityLog::log('create', 'Category', $category->id, null, $category->toArray(), "Menambahkan kategori: {$category->name}");

        return response()->json([
            'message' => 'Kategori berhasil ditambahkan',
            'data' => $category,
        ], 201);
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json(['data' => $category->loadCount('items')]);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
        ]);

        $oldValues = $category->toArray();
        $category->update($validated);

        ActivityLog::log('update', 'Category', $category->id, $oldValues, $category->fresh()->toArray(), "Mengubah kategori: {$category->name}");

        return response()->json([
            'message' => 'Kategori berhasil diperbarui',
            'data' => $category,
        ]);
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->items()->count() > 0) {
            return response()->json(['message' => 'Kategori tidak bisa dihapus karena masih memiliki barang'], 422);
        }

        $oldValues = $category->toArray();
        $category->delete();

        ActivityLog::log('delete', 'Category', $oldValues['id'], $oldValues, null, "Menghapus kategori: {$oldValues['name']}");

        return response()->json(['message' => 'Kategori berhasil dihapus']);
    }
}
