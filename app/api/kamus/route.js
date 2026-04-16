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
    const type = searchParams.get('type');
    const keyword = searchParams.get('q');
    const periodeFilter = searchParams.get('periode');
    if (type === 'sasaran') {
      if (!keyword) return NextResponse.json([]);

      const querySasaran = `
        SELECT DISTINCT sasaran_strategis AS sasaran, perspektif_bsc AS bidang 
        FROM kamus_kpi 
        WHERE sasaran_strategis LIKE ? AND sasaran_strategis IS NOT NULL
        LIMIT 10
      `;
      
      const [hasilSasaran] = await db.execute(querySasaran, [`%${keyword}%`]);

      return NextResponse.json(hasilSasaran);
    }

    if (type === 'acuan_vp') {
      const targetPeriode = periodeFilter; 
      
      const deptId = user.departemen_id || 0;
      const kompId = user.kompartemen_id || 0;

      let queryAcuan = `
        SELECT k.*, p.nama AS pembuat_nama 
        FROM kamus_kpi k 
        JOIN karyawan p ON k.dibuat_oleh = p.id 
        WHERE p.role = 'manajemen' 
          AND (p.departemen_id = ? OR p.kompartemen_id = ?)
      `;
      let paramsAcuan = [deptId, kompId];

      if (targetPeriode) {
          queryAcuan += ` AND k.periode = ?`;
          paramsAcuan.push(targetPeriode);
      }

      queryAcuan += ` ORDER BY k.nama_kpi ASC`;

      console.log("🔍 CEK ACUAN VP - Parameter Dept:", deptId, "Komp:", kompId, "Periode:", targetPeriode);

      const [hasilAcuan] = await db.execute(queryAcuan, paramsAcuan);
      
      console.log("✅ Ditemukan:", hasilAcuan.length, "KPI dari VP");

      return NextResponse.json({ data: hasilAcuan });
    }

    const statusFilter = searchParams.get('status');
    let query = '';
    let params = [];

    if (user.role === 'admin') {
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

    } else if (user.role === 'key_partner') {
      if (statusFilter) {
        query = `SELECT k.*, p.nama AS pembuat_nama, p.unit_kerja AS pembuat_unit
                 FROM kamus_kpi k LEFT JOIN karyawan p ON k.dibuat_oleh = p.id
                 WHERE p.unit_kerja = ? AND p.role = 'user' AND k.status = ? ORDER BY k.created_at DESC`;
        params = [user.unit_kerja, statusFilter];
      } else {
        query = `SELECT k.*, p.nama AS pembuat_nama, p.unit_kerja AS pembuat_unit
                 FROM kamus_kpi k LEFT JOIN karyawan p ON k.dibuat_oleh = p.id
                 WHERE p.unit_kerja = ? AND p.role = 'user' ORDER BY k.created_at DESC`;
        params = [user.unit_kerja];
      }

 } else if (user.role === 'manajemen') {
      let filterStatusSql = statusFilter ? `AND k.status = '${statusFilter}'` : '';
      const isMine = searchParams.get('mine') === 'true';

      if (isMine) {
        query = `SELECT k.*, p.nama AS pembuat_nama, p.unit_kerja AS pembuat_unit
                 FROM kamus_kpi k LEFT JOIN karyawan p ON k.dibuat_oleh = p.id
                 WHERE k.dibuat_oleh = ? ${filterStatusSql} ORDER BY k.created_at DESC`;
        params = [user.id];

      } else if (user.departemen_id) {
        query = `SELECT k.*, p.nama AS pembuat_nama, p.unit_kerja AS pembuat_unit
                 FROM kamus_kpi k LEFT JOIN karyawan p ON k.dibuat_oleh = p.id
                 WHERE p.departemen_id = ? AND p.role = 'user' ${filterStatusSql}
                 ORDER BY k.created_at DESC`;
        params = [user.departemen_id];

      } else if (user.kompartemen_id) {
        query = `SELECT k.*, p.nama AS pembuat_nama, p.unit_kerja AS pembuat_unit
                 FROM kamus_kpi k 
                 LEFT JOIN karyawan p ON k.dibuat_oleh = p.id
                 LEFT JOIN departemen d ON p.departemen_id = d.id
                 WHERE (p.kompartemen_id = ? OR d.kompartemen_id = ?) 
                   AND p.role = 'manajemen' 
                   AND p.departemen_id IS NOT NULL ${filterStatusSql}
                 ORDER BY k.created_at DESC`;
        params = [user.kompartemen_id, user.kompartemen_id];

      } else if (user.direktorat_id) {
        query = `SELECT k.*, p.nama AS pembuat_nama, p.unit_kerja AS pembuat_unit
                 FROM kamus_kpi k 
                 LEFT JOIN karyawan p ON k.dibuat_oleh = p.id
                 LEFT JOIN kompartemen komp ON p.kompartemen_id = komp.id
                 WHERE (p.direktorat_id = ? OR komp.direktorat_id = ?) 
                   AND p.role = 'manajemen' 
                   AND p.kompartemen_id IS NOT NULL 
                   AND p.departemen_id IS NULL ${filterStatusSql}
                 ORDER BY k.created_at DESC`;
        params = [user.direktorat_id, user.direktorat_id];

      } else {
        query = `SELECT k.*, p.nama AS pembuat_nama, p.unit_kerja AS pembuat_unit
                 FROM kamus_kpi k LEFT JOIN karyawan p ON k.dibuat_oleh = p.id
                 WHERE p.unit_kerja = ? ${filterStatusSql} ORDER BY k.created_at DESC`;
        params = [user.unit_kerja];
      }

    } else {
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
    const currentYear = new Date().getFullYear().toString();

    const [result] = await db.execute(`
      INSERT INTO kamus_kpi (
        perspektif_bsc, sasaran_strategis, nama_kpi, definisi_kpi, tujuan_kpi,
        tipe_kpi, formula_penilaian, jenis_pengukuran, polaritas, frekuensi,
        target_jan, target_feb, target_mar, target_apr, target_mei, target_jun,
        target_jul, target_agt, target_sep, target_okt, target_nov, target_des,
        target_tahunan, sumber_data, satuan, validitas, nilai_maksimum,
        dibuat_oleh, status, periode
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
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
      user.id, finalStatus, body.periode || currentYear
    ]);

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}