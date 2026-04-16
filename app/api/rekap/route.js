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

    let query = '';
    let params = [];

    if (user.role === 'admin') {
      query = `
        SELECT 
          p.id AS karyawan_id, p.nama, p.npk, p.unit_kerja,
          k.* FROM karyawan p
        INNER JOIN kamus_kpi k ON p.id = k.dibuat_oleh
        ORDER BY p.unit_kerja ASC, p.nama ASC, k.created_at DESC
      `;
    } else if (user.role === 'key_partner' || user.role === 'manajemen') {
      query = `
        SELECT 
          p.id AS karyawan_id, p.nama, p.npk, p.unit_kerja,
          k.* FROM karyawan p
        INNER JOIN kamus_kpi k ON p.id = k.dibuat_oleh
        WHERE p.unit_kerja = ?
        ORDER BY p.nama ASC, k.created_at DESC
      `;
      params = [user.unit_kerja];
    } else {
      query = `
        SELECT 
          p.id AS karyawan_id, p.nama, p.npk, p.unit_kerja,
          k.* FROM karyawan p
        INNER JOIN kamus_kpi k ON p.id = k.dibuat_oleh
        WHERE p.id = ?
        ORDER BY k.created_at DESC
      `;
      params = [user.id];
    }

    const [rows] = await db.execute(query, params);

    const groupedData = {};

    for (const row of rows) {
      const kId = row.karyawan_id;

      if (!groupedData[kId]) {
        groupedData[kId] = {
          id: kId, nama: row.nama, npk: row.npk, unit_kerja: row.unit_kerja, kpi: [] 
        };
      }

      if (row.id) { 
        groupedData[kId].kpi.push({
          id: row.id,
          nama_kpi: row.nama_kpi,
          perspektif_bsc: row.perspektif_bsc,
          sasaran_strategis: row.sasaran_strategis,
          definisi_kpi: row.definisi_kpi,
          tujuan_kpi: row.tujuan_kpi,
          tipe_kpi: row.tipe_kpi,
          formula_penilaian: row.formula_penilaian,
          jenis_pengukuran: row.jenis_pengukuran,
          polaritas: row.polaritas,
          frekuensi: row.frekuensi,
          satuan: row.satuan,
          target_tahunan: row.target_tahunan,
          status: row.status,
          created_at: row.created_at,
          target_jan: row.target_jan, realisasi_jan: row.realisasi_jan,
          target_feb: row.target_feb, realisasi_feb: row.realisasi_feb,
          target_mar: row.target_mar, realisasi_mar: row.realisasi_mar,
          target_apr: row.target_apr, realisasi_apr: row.realisasi_apr,
          target_mei: row.target_mei, realisasi_mei: row.realisasi_mei,
          target_jun: row.target_jun, realisasi_jun: row.realisasi_jun,
          target_jul: row.target_jul, realisasi_jul: row.realisasi_jul,
          target_agt: row.target_agt, realisasi_agt: row.realisasi_agt,
          target_sep: row.target_sep, realisasi_sep: row.realisasi_sep,
          target_okt: row.target_okt, realisasi_okt: row.realisasi_okt,
          target_nov: row.target_nov, realisasi_nov: row.realisasi_nov,
          target_des: row.target_des, realisasi_des: row.realisasi_des,
        });
      }
    }

    const BULAN = ['jan','feb','mar','apr','mei','jun','jul','agt','sep','okt','nov','des'];

    const hasilAkhir = Object.values(groupedData).map(karyawan => {
      let totalPencapaian = 0;
      let kpiValid = 0;

      karyawan.kpi.forEach(k => {
        if (k.status !== 'approved') return; 

        let subTotalBulan = 0;
        let bulanValid = 0;

        BULAN.forEach(b => {
          const target = parseFloat(k[`target_${b}`]) || 0;
          const realisasi = parseFloat(k[`realisasi_${b}`]) || 0;

          if (target > 0) {
            let pct = (realisasi / target) * 100;
            if (k.polaritas?.toLowerCase() === 'minimize') {
               pct = (target / realisasi) * 100;
            }
            subTotalBulan += pct;
            bulanValid++;
          }
        });

        if (bulanValid > 0) {
          totalPencapaian += (subTotalBulan / bulanValid);
          kpiValid++;
        }
      });

      let rawProgress = kpiValid === 0 ? 0 : Math.round(totalPencapaian / kpiValid);
      
      karyawan.progressPct = rawProgress > 100 ? 100 : rawProgress;

      return karyawan;
    });

    return NextResponse.json({ data: hasilAkhir });
  } catch (error) {
    console.error("Error API Rekap:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}