<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Inventaris Barang</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 11px; }
        h1 { text-align: center; font-size: 16px; margin-bottom: 5px; }
        h2 { text-align: center; font-size: 12px; font-weight: normal; margin-top: 0; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #333; padding: 5px 8px; text-align: left; }
        th { background-color: #1e3a5f; color: white; font-size: 10px; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .footer { margin-top: 20px; text-align: right; font-size: 10px; color: #666; }
    </style>
</head>
<body>
    <h1>LAPORAN INVENTARIS BARANG</h1>
    <h2>SiINDAH — Sistem Inventaris Data & Hardware</h2>
    <h2>Dicetak: {{ date('d F Y') }}</h2>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kode</th>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Lokasi</th>
                <th>Jumlah</th>
                <th>Kondisi</th>
                <th>Tgl Perolehan</th>
                <th>Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $item->code }}</td>
                <td>{{ $item->name }}</td>
                <td>{{ $item->category->name }}</td>
                <td>{{ $item->location->name }}</td>
                <td>{{ $item->quantity }}</td>
                <td>
                    @switch($item->condition)
                        @case('baik') Baik @break
                        @case('rusak_ringan') Rusak Ringan @break
                        @case('rusak_berat') Rusak Berat @break
                        @case('hilang') Hilang @break
                    @endswitch
                </td>
                <td>{{ $item->acquisition_date?->format('d/m/Y') }}</td>
                <td>{{ $item->description }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Total: {{ count($items) }} barang | Dicetak oleh SiINDAH
    </div>
</body>
</html>
