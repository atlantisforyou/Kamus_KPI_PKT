import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request, { params }) {
    try {
        const { id } = await params; 
        
        const body = await request.json();
        const { role, is_active } = body;

        let updateFields = [];
        let queryValues = [];

        if (role !== undefined) {
            updateFields.push('role = ?');
            queryValues.push(role);
        }

        if (is_active !== undefined) {
            updateFields.push('is_active = ?');
            queryValues.push(is_active);
        }

        if (updateFields.length === 0) {
            return NextResponse.json({ error: 'Tidak ada data untuk diupdate' }, { status: 400 });
        }

        queryValues.push(id);
        const setQuery = updateFields.join(', ');

        const [result] = await db.execute(
            `UPDATE karyawan SET ${setQuery}, updated_at = NOW() WHERE id = ?`,
            queryValues
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Karyawan tidak ditemukan' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Data berhasil diperbarui' });

    } catch (error) {
        console.error('PUT Error:', error);
        return NextResponse.json({ error: 'Gagal memperbarui data server' }, { status: 500 });
    }
}