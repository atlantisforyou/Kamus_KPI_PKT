    import { NextResponse } from 'next/server';
    import bcrypt from 'bcryptjs';
    import db from '@/lib/db';

    // POST /api/karyawan/[id]/reset-password
    export async function POST(request, context) {
    try {
        const { id } = await context.params;

        const [rows] = await db.execute(
        'SELECT npk FROM karyawan WHERE id = ?', [id]
        );

        if (rows.length === 0) {
        return NextResponse.json({ error: 'Karyawan tidak ditemukan' }, { status: 404 });
        }

        const { npk } = rows[0];
        const newHash = await bcrypt.hash(npk, 10);

        await db.execute(
        'UPDATE karyawan SET password = ? WHERE id = ?',
        [newHash, id]
        );

        return NextResponse.json({ success: true, message: `Password direset ke NPK` });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    }