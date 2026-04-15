<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function exportPdf(Request $request)
    {
        $query = Item::with(['category', 'location']);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('condition')) {
            $query->where('condition', $request->condition);
        }
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        $items = $query->orderBy('code')->get();

        $html = view('reports.items', compact('items'))->render();

        $pdf = Pdf::loadHTML($html)->setPaper('a4', 'landscape');

        return $pdf->download('laporan-inventaris-' . date('Y-m-d') . '.pdf');
    }

    public function exportExcel(Request $request)
    {
        $query = Item::with(['category', 'location']);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('condition')) {
            $query->where('condition', $request->condition);
        }
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        $items = $query->orderBy('code')->get();

        $csvData = "Kode,Nama Barang,Kategori,Lokasi,Jumlah,Kondisi,Tanggal Perolehan,Deskripsi\n";
        foreach ($items as $item) {
            $condition = match($item->condition) {
                'baik' => 'Baik',
                'rusak_ringan' => 'Rusak Ringan',
                'rusak_berat' => 'Rusak Berat',
                'hilang' => 'Hilang',
                default => $item->condition,
            };
            $csvData .= "\"{$item->code}\",\"{$item->name}\",\"{$item->category->name}\",\"{$item->location->name}\",{$item->quantity},\"{$condition}\",\"{$item->acquisition_date?->format('Y-m-d')}\",\"{$item->description}\"\n";
        }

        return response($csvData)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="laporan-inventaris-' . date('Y-m-d') . '.csv"');
    }
}
