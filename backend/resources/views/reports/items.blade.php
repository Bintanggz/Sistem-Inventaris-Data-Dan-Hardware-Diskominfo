<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Inventaris Barang</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 9px; }
        h1 { text-align: center; font-size: 14px; margin-bottom: 3px; }
        h2 { text-align: center; font-size: 10px; font-weight: normal; margin-top: 0; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #333; padding: 4px 5px; text-align: left; vertical-align: middle; }
        th { background-color: #1e3a5f; color: white; font-size: 8px; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .footer { margin-top: 16px; text-align: right; font-size: 9px; color: #666; }
        .badge-baik { background:#d1fae5; color:#065f46; padding:1px 4px; border-radius:3px; }
        .badge-pengadaan { background:#fed7aa; color:#92400e; padding:1px 4px; border-radius:3px; }
        .badge-ganti { background:#fee2e2; color:#991b1b; padding:1px 4px; border-radius:3px; }
        .text-center { text-align: center; }
    </style>
</head>
<body>
    <h1>DATA INVENTORY BARANG DISKOMINFO KARANGANYAR</h1>
    <h2>SiINDAH — Sistem Inventaris Data & Hardware</h2>
    <h2>Filter: {{ $kondisiUmurLabel ?? 'Semua Kondisi' }} | Dicetak: {{ date('d F Y') }}</h2>

    <table>
        <thead>
            <tr>
                <th class="text-center">No</th>
                <th>Kategori Barang</th>
                <th>Merk / Type</th>
                <th>Serial Number Device</th>
                <th>Tgl Barang Masuk</th>
                <th>Metode Pengadaan</th>
                <th>Status Barang</th>
                <th>Lokasi Barang</th>
                <th class="text-center">Umur Barang (th)</th>
                <th class="text-center">Sisa Umur (th)</th>
                <th>Kondisi Barang</th>
                <th>Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
            @php
                $age = $item->acquisition_date ? (int) abs(now()->diffInYears($item->acquisition_date)) : 0;
                $remaining = 5 - $age;
                $kondisi = $age <= 3 ? 'Masih Baik' : ($age <= 5 ? 'Siap Rencana Pengadaan' : 'Disarankan Ganti');
                $badgeClass = $age <= 3 ? 'badge-baik' : ($age <= 5 ? 'badge-pengadaan' : 'badge-ganti');
            @endphp
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $item->category->name }}</td>
                <td>{{ $item->name }}</td>
                <td>{{ $item->serial_number_device ?? '-' }}</td>
                <td>{{ $item->acquisition_date?->format('d/m/Y') ?? '-' }}</td>
                <td>{{ $item->procurement_method ?? '-' }}</td>
                <td>{{ $item->status ?? '-' }}</td>
                <td>{{ $item->location->name }}</td>
                <td class="text-center">{{ $age }}</td>
                <td class="text-center">{{ $remaining }}</td>
                <td><span class="{{ $badgeClass }}">{{ $kondisi }}</span></td>
                <td>{{ $item->description }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Total: {{ count($items) }} barang | Dicetak oleh SiINDAH — {{ date('d/m/Y H:i') }}
    </div>
</body>
</html>

