<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Borrowing;
use App\Models\Item;
use App\Models\Category;
use App\Models\Location;
use App\Models\Maintenance;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'total_items' => Item::count(),
            'total_categories' => Category::count(),
            'total_locations' => Location::count(),
            'total_quantity' => Item::sum('quantity'),
            'condition_stats' => [
                'baik' => Item::where('condition', 'baik')->count(),
                'rusak_ringan' => Item::where('condition', 'rusak_ringan')->count(),
                'rusak_berat' => Item::where('condition', 'rusak_berat')->count(),
                'hilang' => Item::where('condition', 'hilang')->count(),
            ],
            'active_borrowings' => Borrowing::where('status', 'dipinjam')->count(),
            'overdue_borrowings' => Borrowing::where('status', 'dipinjam')
                ->where('due_date', '<', now())
                ->count(),
            'active_maintenance' => Maintenance::whereIn('status', ['pending', 'in_progress'])->count(),
        ]);
    }

    public function charts(): JsonResponse
    {
        $categoryData = Category::withCount('items')->get()->map(fn($c) => [
            'name' => $c->name,
            'value' => $c->items_count,
        ]);

        $locationData = Location::withCount('items')->get()->map(fn($l) => [
            'name' => $l->name,
            'value' => $l->items_count,
        ]);

        $conditionData = [
            ['name' => 'Baik', 'value' => Item::where('condition', 'baik')->count()],
            ['name' => 'Rusak Ringan', 'value' => Item::where('condition', 'rusak_ringan')->count()],
            ['name' => 'Rusak Berat', 'value' => Item::where('condition', 'rusak_berat')->count()],
            ['name' => 'Hilang', 'value' => Item::where('condition', 'hilang')->count()],
        ];

        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthlyData[] = [
                'month' => $date->translatedFormat('M Y'),
                'masuk' => Item::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'pinjam' => Borrowing::whereYear('borrow_date', $date->year)
                    ->whereMonth('borrow_date', $date->month)
                    ->count(),
            ];
        }

        return response()->json([
            'categories' => $categoryData,
            'locations' => $locationData,
            'conditions' => $conditionData,
            'monthly' => $monthlyData,
        ]);
    }
}
