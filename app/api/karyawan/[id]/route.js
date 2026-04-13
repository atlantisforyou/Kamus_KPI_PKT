import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import * as xlsx from 'xlsx';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const [rows] = await db.execute(`
            SELECT 
                k.id, k.npk, k.nama, k.role, k.is_active, k.unit_kerja,
                dir.nama AS nama_dir, 
                komp.nama AS nama_komp, 
                dept.nama AS nama_dept
            FROM karyawan k
            LEFT JOIN departemen dept ON k.departemen_id = dept.id
            LEFT JOIN kompartemen komp ON dept.kompartemen_id = komp.id
            LEFT JOIN direktorat dir ON komp.direktorat_id = dir.id
            ORDER BY dir.nama ASC, komp.nama ASC, dept.nama ASC, k.nama ASC
        `);
        return NextResponse.json({ data: rows });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file');

            if (!file) return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });

            const buffer = await file.arrayBuffer();
            const workbook = xlsx.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const dataExcel = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

            let successCount = 0;
            let missingDeptCount = 0;

            for (const row of dataExcel) {
                const npkString = row['NPK'] ? String(row['NPK']).trim() : '';
                const nama = row['NAMA'] ? String(row['NAMA']).trim() : '';
                const unitKerja = row['UNIT KERJA'] ? String(row['UNIT KERJA']).trim() : 'Tanpa Unit Kerja';

                if (!npkString || !nama) continue;

                try {
                    const [deptRows] = await db.execute('SELECT id FROM departemen WHERE nama = ? LIMIT 1', [unitKerja]);
                    
                    let deptId = null;
                    if (deptRows.length > 0) {
                        deptId = deptRows[0].id;
                    } else {
                        missingDeptCount++;
                    }

                    const hashedPassword = await bcrypt.hash(`${npkString}123`, 10);
                    const [existing] = await db.execute('SELECT id FROM karyawan WHERE npk = ?', [npkString]);
                    
                    if (existing.length > 0) {
                        await db.execute(
                            'UPDATE karyawan SET nama = ?, departemen_id = ?, unit_kerja = ? WHERE npk = ?',
                            [nama, deptId, unitKerja, npkString]
                        );
                    } else {
                        await db.execute(
                            'INSERT INTO karyawan (npk, nama, password, role, is_active, departemen_id, unit_kerja, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
                            [npkString, nama, hashedPassword, 'user', 1, deptId, unitKerja]
                        );
                    }
                    successCount++;
                } catch (rowError) {
                    console.error(`Gagal import NPK ${npkString}:`, rowError.message);
                }
            }

            let msg = `Berhasil memproses ${successCount} karyawan.`;
            if (missingDeptCount > 0) {
                msg += ` (${missingDeptCount} orang tanpa Departemen/belum sesuai struktur)`;
            }

            return NextResponse.json({ message: msg });
        } 
        
        else {
            const { npk, nama, unit_kerja, role } = await request.json();

            if (!npk?.trim() || !nama?.trim()) return NextResponse.json({ error: 'NPK dan Nama wajib diisi' }, { status: 400 });

            const npkUpper = npk.trim().toUpperCase();
            const [existing] = await db.execute('SELECT id FROM karyawan WHERE npk = ?', [npkUpper]);
            
            if (existing.length > 0) return NextResponse.json({ error: `NPK ${npkUpper} sudah terdaftar` }, { status: 409 });

            const hashedPassword = await bcrypt.hash(npkUpper, 10);
            await db.execute(
                `INSERT INTO karyawan (npk, nama, unit_kerja, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
                [npkUpper, nama.trim(), unit_kerja?.trim() || '', hashedPassword, role || 'user']
            );

            return NextResponse.json({ success: true, message: 'Karyawan berhasil ditambahkan' });
        }

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Terjadi kesalahan sistem' }, { status: 500 });
    }
}