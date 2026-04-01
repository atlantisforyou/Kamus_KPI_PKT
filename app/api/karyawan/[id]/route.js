    import { NextResponse } from 'next/server';
    import db from '@/lib/db';

    // GET /api/karyawan/[id]
    export async function GET(request, context) {
    try {
        const { id } = await context.params;
        const [rows] = await db.execute(
        'SELECT id, npk, nama, unit_kerja, role, is_active FROM karyawan WHERE id = ?',
        [id]
        );
        if (rows.length === 0) {
        return NextResponse.json({ error: 'Karyawan tidak ditemukan' }, { status: 404 });
        }
        return NextResponse.json({ data: rows[0] });
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    }

    // PUT /api/karyawan/[id] — update role atau is_active
    export async function PUT(request, context) {
    try {
        // Next.js 15: params harus di-await
        const { id } = await context.params;
        const body = await request.json();

        console.log('PUT karyawan id:', id, 'body:', body);

        const allowed = ['role', 'is_active'];
        const updates = [];
        const values = [];

        for (const key of allowed) {
        if (body[key] !== undefined) {
            updates.push(`${key} = ?`);
            values.push(body[key]);
        }
        }

        if (updates.length === 0) {
        return NextResponse.json({ error: 'Tidak ada field yang diupdate' }, { status: 400 });
        }

        values.push(id);

        const sql = `UPDATE karyawan SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`;
        console.log('SQL:', sql, values);

        await db.execute(sql, values);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('PUT karyawan error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    }