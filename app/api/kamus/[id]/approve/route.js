import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import db from '@/lib/db';

// ════════════════════════════════════════════════════════════
// 1. POST: Untuk Key Partner & Manajemen (Sistem Approve/Review)
// ════════════════════════════════════════════════════════════
export async function POST(request, context) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = verifyToken(token);

    if (!user || !['key_partner', 'manajemen'].includes(user.role)) {
      return NextResponse.json({ error: 'Akses ditolak. Hanya Key Partner dan Manajemen yang diizinkan.' }, { status: 403 });
    }

    const payload = await request.json();
    const action = payload.action; 

    const [rows] = await db.execute(
      `SELECT k.id, k.status, u.unit_kerja AS unit_pembuat 
       FROM kamus_kpi k 
       JOIN karyawan u ON k.dibuat_oleh = u.id 
       WHERE k.id = ?`, 
      [id]
    );

    if (rows.length === 0) return NextResponse.json({ error: 'KPI tidak ditemukan' }, { status: 404 });

    const currentStatus = rows[0].status;
    let newStatus, updateQuery = '', params = [], message = '';

    if (user.role === 'key_partner') {
      const userUnit = (user.unit_kerja || '').trim().toLowerCase();
      const kpiUnit  = (rows[0].unit_pembuat || '').trim().toLowerCase();

      if (userUnit !== kpiUnit) return NextResponse.json({ error: `Akses Ditolak.` }, { status: 403 });
      if (currentStatus !== 'submitted') return NextResponse.json({ error: 'KPI tidak sedang dalam status Menunggu Review.' }, { status: 400 });

      if (action === 'forward') {
        newStatus = 'reviewed';
        message = 'KPI berhasil direview';
      } else if (action === 'revisi') {
        newStatus = 'revisi';
        message = 'KPI dikembalikan untuk direvisi';
      } else {
        return NextResponse.json({ error: 'Aksi tidak valid' }, { status: 400 });
      }

      updateQuery = `UPDATE kamus_kpi SET status = ?, reviewed_by = ?, reviewed_at = NOW(), updated_at = NOW() WHERE id = ?`;
      params = [newStatus, user.id, id];
    } 
    else if (user.role === 'manajemen') {
      if (currentStatus !== 'reviewed') return NextResponse.json({ error: 'KPI belum direview.' }, { status: 400 });

      if (action === 'approve') {
        newStatus = 'approved';
        message = 'KPI berhasil disetujui';
      } else if (action === 'revisi') {
        newStatus = 'revisi';
        message = 'KPI dikembalikan untuk direvisi';
      } else {
        return NextResponse.json({ error: 'Aksi tidak valid' }, { status: 400 });
      }

      updateQuery = `UPDATE kamus_kpi SET status = ?, approved_by = ?, approved_at = NOW(), updated_at = NOW() WHERE id = ?`;
      params = [newStatus, user.id, id];
    }

    await db.execute(updateQuery, params);
    return NextResponse.json({ success: true, message });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ════════════════════════════════════════════════════════════
// 2. PATCH: Untuk Admin Bypass Status (Dari Halaman Monitoring)
// ════════════════════════════════════════════════════════════
export async function PATCH(request, context) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = verifyToken(token);

    // Hanya admin yang boleh pakai jalur pintas ini
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Akses ditolak. Hanya Admin yang diizinkan.' }, { status: 403 });
    }

    const payload = await request.json();
    const { status } = payload;

    if (!status) {
      return NextResponse.json({ error: 'Status harus diisi' }, { status: 400 });
    }

    const [rows] = await db.execute('SELECT id FROM kamus_kpi WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'KPI tidak ditemukan' }, { status: 404 });
    }

    await db.execute(
      'UPDATE kamus_kpi SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    return NextResponse.json({ success: true, message: `Status berhasil diubah menjadi ${status}` });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}