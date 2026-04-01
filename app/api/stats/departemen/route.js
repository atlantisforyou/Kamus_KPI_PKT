import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = verifyToken(token);
    if (!user || !['admin', 'manajemen'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Hitung total karyawan per unit kerja
    const [unitRows] = await pool.query(`
      SELECT unit_kerja, COUNT(*) as total_karyawan
      FROM karyawan
      WHERE is_active = 1 AND unit_kerja IS NOT NULL AND unit_kerja != ''
      GROUP BY unit_kerja
      ORDER BY unit_kerja ASC
    `);

    // Hitung KPI approved per pembuat, lalu group ke unit kerja
    const [kamusRows] = await pool.query(`
      SELECT k.unit_kerja, COUNT(kp.id) as total_approved
      FROM karyawan k
      LEFT JOIN kamus_kpi kp ON kp.dibuat_oleh = k.id AND kp.status = 'approved'
      WHERE k.is_active = 1 AND k.unit_kerja IS NOT NULL AND k.unit_kerja != ''
      GROUP BY k.unit_kerja
    `);

    // Hitung total KPI (semua status) per unit
    const [totalKamusRows] = await pool.query(`
      SELECT k.unit_kerja, COUNT(kp.id) as total_kamus
      FROM karyawan k
      LEFT JOIN kamus_kpi kp ON kp.dibuat_oleh = k.id
      WHERE k.is_active = 1 AND k.unit_kerja IS NOT NULL AND k.unit_kerja != ''
      GROUP BY k.unit_kerja
    `);

    // Merge data
    const approvedMap   = Object.fromEntries(kamusRows.map(r => [r.unit_kerja, Number(r.total_approved)]));
    const totalKamusMap = Object.fromEntries(totalKamusRows.map(r => [r.unit_kerja, Number(r.total_kamus)]));

    const result = unitRows.map((r, i) => {
      const unit         = r.unit_kerja;
      const totalKamus   = totalKamusMap[unit] || 0;
      const approved     = approvedMap[unit]   || 0;
      const pct          = totalKamus > 0 ? Math.round((approved / totalKamus) * 100) : 0;

      // Warna progress bar berurutan
      const COLORS = ['#3b7dd8', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#0d9488', '#ec4899'];
      return {
        unit_kerja:     unit,
        total_karyawan: Number(r.total_karyawan),
        total_kamus:    totalKamus,
        approved,
        pct,
        color: COLORS[i % COLORS.length],
      };
    });

    // Sort: pct tertinggi di atas
    result.sort((a, b) => b.pct - a.pct);

    return NextResponse.json({ data: result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}