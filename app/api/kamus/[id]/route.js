import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import db from '@/lib/db';

// GET /api/kamus/[id]
export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [rows] = await db.execute(
      `SELECT k.*, p.nama AS pembuat_nama, p.unit_kerja AS pembuat_unit
       FROM kamus_kpi k
       LEFT JOIN karyawan p ON k.dibuat_oleh = p.id
       WHERE k.id = ?`,
      [id]
    );

    if (rows.length === 0) return NextResponse.json({ error: 'KPI tidak ditemukan' }, { status: 404 });

    const kpi = rows[0];
    if (user.role === 'user' && Number(kpi.dibuat_oleh) !== Number(user.id)) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    return NextResponse.json({ data: kpi });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/kamus/[id]
export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [rows] = await db.execute(
      'SELECT id, dibuat_oleh, status FROM kamus_kpi WHERE id = ?', [id]
    );
    if (rows.length === 0) return NextResponse.json({ error: 'KPI tidak ditemukan' }, { status: 404 });

    const kpi = rows[0];
    if (user.role !== 'admin' && Number(kpi.dibuat_oleh) !== Number(user.id)) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const payload = await request.json();
    const finalStatus = payload.status || 'draft';

    await db.execute(`
      UPDATE kamus_kpi SET
        perspektif_bsc = ?, sasaran_strategis = ?, nama_kpi = ?,
        definisi_kpi = ?, tujuan_kpi = ?, tipe_kpi = ?,
        formula_penilaian = ?, jenis_pengukuran = ?, polaritas = ?, frekuensi = ?,
        target_jan = ?, target_feb = ?, target_mar = ?, target_apr = ?,
        target_mei = ?, target_jun = ?, target_jul = ?, target_agt = ?,
        target_sep = ?, target_okt = ?, target_nov = ?, target_des = ?,
        target_tahunan = ?, sumber_data = ?, satuan = ?,
        validitas = ?, nilai_maksimum = ?,
        status = ?, updated_at = NOW()
      WHERE id = ?
    `, [
      payload.perspektif_bsc, payload.sasaran_strategis, payload.nama_kpi,
      payload.definisi_kpi, payload.tujuan_kpi, payload.tipe_kpi,
      payload.formula_penilaian, payload.jenis_pengukuran, payload.polaritas, payload.frekuensi,
      payload.target_jan || null, payload.target_feb || null, payload.target_mar || null, payload.target_apr || null,
      payload.target_mei || null, payload.target_jun || null, payload.target_jul || null, payload.target_agt || null,
      payload.target_sep || null, payload.target_okt || null, payload.target_nov || null, payload.target_des || null,
      payload.target_tahunan || null, payload.sumber_data, payload.satuan,
      payload.validitas, payload.nilai_maksimum || null,
      finalStatus, id,
    ]);

    return NextResponse.json({ success: true, message: 'Berhasil diupdate menjadi ' + finalStatus });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/kamus/[id]
export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return NextResponse.json({ error: 'Hanya admin yang dapat menghapus KPI' }, { status: 403 });

    const [rows] = await db.execute('SELECT id FROM kamus_kpi WHERE id = ?', [id]);
    if (rows.length === 0) return NextResponse.json({ error: 'KPI tidak ditemukan' }, { status: 404 });

    await db.execute('DELETE FROM kamus_kpi WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}