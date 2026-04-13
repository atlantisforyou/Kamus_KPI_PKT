import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    
    // ════════════ TAMBAHAN: FITUR PENCARIAN SASARAN ════════════
    const type = searchParams.get('type');
    const keyword = searchParams.get('q');

    // Jika request memiliki parameter ?type=sasaran, jalankan query ke master_sasaran
    if (type === 'sasaran') {
      if (!keyword) return NextResponse.json([]); // Kalau input kosong, kembalikan array kosong

      const querySasaran = `SELECT id, bidang, sasaran FROM master_sasaran WHERE sasaran LIKE ? LIMIT 10`;
      const [hasilSasaran] = await db.execute(querySasaran, [`%${keyword}%`]);
      
      // Langsung return hasilnya dan hentikan proses GET di sini
      return NextResponse.json(hasilSasaran);
    }
    // ════════════════════════════════════════════════════════════

    // --- KODE ASLI UNTUK MENGAMBIL LIST KAMUS KPI ---
    const statusFilter = searchParams.get('status');

    let query = '';
    let params = [];

    if (user.role === 'admin') {
      // Admin: lihat semua tanpa filter
      if (statusFilter) {
        query = `SELECT k.*, p.nama AS pembuat_nama, p.unit_kerja AS pembuat_unit
                 FROM kamus_kpi k LEFT JOIN karyawan p ON k.dibuat_oleh = p.id
                 WHERE k.status = ? ORDER BY k.created_at DESC`;
        params = [statusFilter];
      } else {
        query = `SELECT k.*, p.nama AS pembuat_nama, p.unit_kerja AS pembuat_unit
                 FROM kamus_kpi k LEFT JOIN karyawan p ON k.dibuat_oleh = p.id
                 ORDER BY k.created_at DESC`;
      }

    } else if (user.role === 'key_partner' || user.role === 'manajemen') {
      // Key Partner & Manajemen: hanya lihat KPI dari unit kerja yang sama
      if (statusFilter) {
        query = `SELECT k.*, p.nama AS pembuat_nama, p.unit_kerja AS pembuat_unit
                 FROM kamus_kpi k LEFT JOIN karyawan p ON k.dibuat_oleh = p.id
                 WHERE p.unit_kerja = ? AND k.status = ?
                 ORDER BY k.created_at DESC`;
        params = [user.unit_kerja, statusFilter];
      } else {
        query = `SELECT k.*, p.nama AS pembuat_nama, p.unit_kerja AS pembuat_unit
                 FROM kamus_kpi k LEFT JOIN karyawan p ON k.dibuat_oleh = p.id
                 WHERE p.unit_kerja = ?
                 ORDER BY k.created_at DESC`;
        params = [user.unit_kerja];
      }

    } else {
      // User: hanya lihat punya sendiri
      if (statusFilter) {
        query = `SELECT k.*, p.nama AS pembuat_nama, p.unit_kerja AS pembuat_unit
                 FROM kamus_kpi k LEFT JOIN karyawan p ON k.dibuat_oleh = p.id
                 WHERE k.dibuat_oleh = ? AND k.status = ?
                 ORDER BY k.created_at DESC`;
        params = [user.id, statusFilter];
      } else {
        query = `SELECT k.*, p.nama AS pembuat_nama, p.unit_kerja AS pembuat_unit
                 FROM kamus_kpi k LEFT JOIN karyawan p ON k.dibuat_oleh = p.id
                 WHERE k.dibuat_oleh = ?
                 ORDER BY k.created_at DESC`;
        params = [user.id];
      }
    }

    const [rows] = await db.execute(query, params);
    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = verifyToken(token);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID Kamus KPI diperlukan' }, { status: 400 });
    }

    await db.execute(`DELETE FROM kamus_kpi WHERE id = ?`, [id]);
    return NextResponse.json({ success: true, message: 'Kamus KPI berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const finalStatus = body.status || 'draft';

    const [result] = await db.execute(`
      INSERT INTO kamus_kpi (
        perspektif_bsc, sasaran_strategis, nama_kpi, definisi_kpi, tujuan_kpi,
        tipe_kpi, formula_penilaian, jenis_pengukuran, polaritas, frekuensi,
        target_jan, target_feb, target_mar, target_apr, target_mei, target_jun,
        target_jul, target_agt, target_sep, target_okt, target_nov, target_des,
        target_tahunan, sumber_data, satuan, validitas, nilai_maksimum,
        dibuat_oleh, status
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `, [
      body.perspektif_bsc, body.sasaran_strategis, body.nama_kpi,
      body.definisi_kpi, body.tujuan_kpi, body.tipe_kpi,
      body.formula_penilaian, body.jenis_pengukuran, body.polaritas,
      body.frekuensi,
      body.target_jan || null, body.target_feb || null, body.target_mar || null, body.target_apr || null,
      body.target_mei || null, body.target_jun || null, body.target_jul || null, body.target_agt || null,
      body.target_sep || null, body.target_okt || null, body.target_nov || null, body.target_des || null,
      body.target_tahunan || null, body.sumber_data, body.satuan,
      body.validitas, body.nilai_maksimum || null,
      user.id, finalStatus,
    ]);

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}