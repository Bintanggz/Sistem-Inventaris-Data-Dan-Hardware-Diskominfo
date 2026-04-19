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

        $csvData = "No,Kategori Barang,Merk / Type,Serial Number Device,Tgl Barang Masuk,Metode Pengadaan,Status Barang,Lokasi Barang,Umur Barang (th),Sisa Umur (th),Kondisi Barang,Keterangan\n";
        foreach ($items as $index => $item) {
            $age = $item->acquisition_date ? (int) abs(now()->diffInYears($item->acquisition_date)) : 0;
            $remaining = 5 - $age;
            $kondisi = $age <= 3 ? 'Masih Baik' : ($age <= 5 ? 'Siap Rencana Pengadaan' : 'Disarankan Ganti');
            $csvData .= ($index + 1) . ",\"{$item->category->name}\",\"{$item->name}\",\"{$item->serial_number_device}\",\"{$item->acquisition_date?->format('d/m/Y')}\",\"{$item->procurement_method}\",\"{$item->status}\",\"{$item->location->name}\",{$age},{$remaining},\"{$kondisi}\",\"{$item->description}\"\n";
        }

        return response($csvData)
            ->header('Content-Type', 'text/csv; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="laporan-inventaris-' . date('Y-m-d') . '.csv"');
    }
}
