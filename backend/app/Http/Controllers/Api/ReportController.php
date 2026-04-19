<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Terapkan filter kategori, lokasi, dan kondisi_umur ke query.
     * Digunakan bersama oleh exportPdf dan exportExcel.
     */
    private function applyFilters(Request $request, $query)
    {
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        // Filter kondisi umur — sesuai logika di halaman Barang & Dashboard
        if ($request->filled('kondisi_umur')) {
            $now = now();
            match ($request->kondisi_umur) {
                'masih_baik'       => $query->whereNotNull('acquisition_date')
                                            ->where('acquisition_date', '>=', $now->copy()->subYears(3)->toDateString()),
                'siap_pengadaan'   => $query->whereNotNull('acquisition_date')
                                            ->where('acquisition_date', '<',  $now->copy()->subYears(3)->toDateString())
                                            ->where('acquisition_date', '>=', $now->copy()->subYears(5)->toDateString()),
                'disarankan_ganti' => $query->whereNotNull('acquisition_date')
                                            ->where('acquisition_date', '<',  $now->copy()->subYears(5)->toDateString()),
                default => null,
            };
        }

        return $query;
    }

    public function exportPdf(Request $request)
    {
        $query = Item::with(['category', 'location']);
        $this->applyFilters($request, $query);

        $items = $query->orderBy('acquisition_date', 'asc')->get();

        $kondisiUmurLabel = match ($request->kondisi_umur ?? '') {
            'masih_baik'       => 'Masih Baik (1–3 tahun)',
            'siap_pengadaan'   => 'Siap Rencana Pengadaan (4–5 tahun)',
            'disarankan_ganti' => 'Disarankan Ganti (>5 tahun)',
            default            => 'Semua Kondisi',
        };

        $html = view('reports.items', compact('items', 'kondisiUmurLabel'))->render();

        $pdf = Pdf::loadHTML($html)->setPaper('a4', 'landscape');

        return $pdf->download('laporan-inventaris-' . date('Y-m-d') . '.pdf');
    }

    public function exportExcel(Request $request)
    {
        $query = Item::with(['category', 'location']);
        $this->applyFilters($request, $query);

        $items = $query->orderBy('acquisition_date', 'asc')->get();

        $csvData = "No,Kategori Barang,Merk / Type,Serial Number Device,Tgl Barang Masuk,Metode Pengadaan,Status Barang,Lokasi Barang,Umur Barang (th),Sisa Umur (th),Kondisi Barang,Keterangan\n";
        foreach ($items as $index => $item) {
            $age       = $item->acquisition_date ? (int) abs(now()->diffInYears($item->acquisition_date)) : 0;
            $remaining = 5 - $age;
            $kondisi   = $age <= 3 ? 'Masih Baik' : ($age <= 5 ? 'Siap Rencana Pengadaan' : 'Disarankan Ganti');
            $csvData  .= ($index + 1) . ",\"{$item->category->name}\",\"{$item->name}\",\"{$item->serial_number_device}\",\"{$item->acquisition_date?->format('d/m/Y')}\",\"{$item->procurement_method}\",\"{$item->status}\",\"{$item->location->name}\",{$age},{$remaining},\"{$kondisi}\",\"{$item->description}\"\n";
        }

        return response($csvData)
            ->header('Content-Type', 'text/csv; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="laporan-inventaris-' . date('Y-m-d') . '.csv"');
    }
}
