    import { NextResponse } from 'next/server';
    import bcrypt from 'bcryptjs';
    import db from '@/lib/db';

    // GET /api/karyawan — list semua karyawan
    export async function GET() {
    try {
        const [rows] = await db.execute(
        `SELECT id, npk, nama, unit_kerja, role, is_active, last_login, created_at
        FROM karyawan ORDER BY nama ASC`
        );
        return NextResponse.json({ data: rows });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    }

    // POST /api/karyawan — tambah karyawan baru
    export async function POST(request) {
    try {
        const { npk, nama, unit_kerja, role } = await request.json();

        if (!npk?.trim()) return NextResponse.json({ error: 'NPK wajib diisi' }, { status: 400 });
        if (!nama?.trim()) return NextResponse.json({ error: 'Nama wajib diisi' }, { status: 400 });

        const npkUpper = npk.trim().toUpperCase();

        // Cek NPK sudah ada
        const [existing] = await db.execute(
        'SELECT id FROM karyawan WHERE npk = ?', [npkUpper]
        );
        if (existing.length > 0) {
        return NextResponse.json({ error: `NPK ${npkUpper} sudah terdaftar` }, { status: 409 });
        }

        // Hash NPK sebagai password
        const hashedPassword = await bcrypt.hash(npkUpper, 10);

        await db.execute(
        `INSERT INTO karyawan (npk, nama, unit_kerja, password, role) VALUES (?, ?, ?, ?, ?)`,
        [npkUpper, nama.trim(), unit_kerja?.trim() || '', hashedPassword, role || 'user']
        );

        return NextResponse.json({ success: true, message: 'Karyawan berhasil ditambahkan' });
    } catch (error) {
        console.error('POST karyawan error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    }