import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
        return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        let berhasil = 0;
        let diperbarui = 0;
        let dilewati = 0;
        const errors = [];

        for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const rowNum = i + 2;

        const npk = String(
            row['NPK'] ?? row['npk'] ?? row['Npk'] ?? ''
        ).trim().toUpperCase();

        const nama = String(
            row['NAMA'] ?? row['nama'] ?? row['Nama'] ?? ''
        ).trim();

        const unit_kerja = String(
            row['UNIT KERJA'] ?? row['unit kerja'] ?? row['Unit Kerja'] ??
            row['UNIT_KERJA'] ?? row['unit_kerja'] ?? ''
        ).trim();

        if (!npk) { errors.push(`Baris ${rowNum}: NPK kosong`); dilewati++; continue; }
        if (!nama) { errors.push(`Baris ${rowNum}: NAMA kosong (NPK: ${npk})`); dilewati++; continue; }

        // Hash NPK sebagai password
        const hashedPassword = await bcrypt.hash(npk, SALT_ROUNDS);

        const [existing] = await db.execute(
            'SELECT id FROM karyawan WHERE npk = ?', [npk]
        );

        if (existing.length > 0) {
            await db.execute(
            'UPDATE karyawan SET nama = ?, unit_kerja = ?, password = ? WHERE npk = ?',
            [nama, unit_kerja, hashedPassword, npk]
            );
            diperbarui++;
        } else {
            await db.execute(
            `INSERT INTO karyawan (npk, nama, unit_kerja, password, role) VALUES (?, ?, ?, ?, 'user')`,
            [npk, nama, unit_kerja, hashedPassword]
            );
            berhasil++;
        }
        }

        return NextResponse.json({
        success: true,
        detail: { baru: berhasil, diperbarui, dilewati, total: berhasil + diperbarui + dilewati },
        errors: errors.length > 0 ? errors : null,
        });

    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}