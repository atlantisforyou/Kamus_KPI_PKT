import { NextResponse } from 'next/server';

export async function GET() {
  try {
    
    const dummyNotices = [
      {
        id: 1,
        tipe: 'info',
        judul: 'Pembaruan Sistem',
        waktu_teks: '2 jam yang lalu',
        pesan: 'Fitur export Kamus KPI ke Excel sekarang sudah dapat digunakan di halaman Rekap.'
      },
      {
        id: 2,
        tipe: 'warning',
        judul: 'Batas Waktu Pengisian KPI',
        waktu_teks: '1 hari yang lalu',
        pesan: 'Harap ingatkan seluruh karyawan bahwa batas akhir submit KPI adalah tanggal 30 bulan ini.'
      },
      {
        id: 3,
        tipe: 'success',
        judul: 'Server Berjalan Normal',
        waktu_teks: '3 hari yang lalu',
        pesan: 'Maintenance server pada akhir pekan lalu telah selesai tanpa kendala.'
      }
    ];

    return NextResponse.json({ data: dummyNotices });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil notifikasi' }, { status: 500 });
  }
}