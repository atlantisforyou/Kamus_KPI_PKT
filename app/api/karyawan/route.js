import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import * as xlsx from 'xlsx';

export const dynamic = 'force-dynamic';

// GET Karyawan
export async function GET() {
    try {
        const [rows] = await db.execute(`
            SELECT 
                k.id, k.npk, k.nama, k.role, k.is_active, k.unit_kerja,
                
                /* Ambil nama dari jalur manapun yang terisi */
                COALESCE(dir_from_dept.nama, dir_from_komp.nama, dir_direct.nama) AS nama_dir, 
                COALESCE(komp_from_dept.nama, komp_direct.nama) AS nama_komp, 
                dept.nama AS nama_dept
                
            FROM karyawan k
            
            /* JALUR 1: Pegawai Level Departemen */
            LEFT JOIN departemen dept ON k.departemen_id = dept.id
            LEFT JOIN kompartemen komp_from_dept ON dept.kompartemen_id = komp_from_dept.id
            LEFT JOIN direktorat dir_from_dept ON komp_from_dept.direktorat_id = dir_from_dept.id
            
            /* JALUR 2: Pegawai Level Kompartemen (Langsung) */
            LEFT JOIN kompartemen komp_direct ON k.kompartemen_id = komp_direct.id
            LEFT JOIN direktorat dir_from_komp ON komp_direct.direktorat_id = dir_from_komp.id
            
            /* JALUR 3: Pegawai Level Direktorat (Langsung) */
            LEFT JOIN direktorat dir_direct ON k.direktorat_id = dir_direct.id
            
            ORDER BY nama_dir ASC, nama_komp ASC, nama_dept ASC, k.nama ASC
        `);
        return NextResponse.json({ data: rows });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST (Tambah & Import)
export async function POST(request) {
    try {
        const contentType = request.headers.get('content-type') || '';

        // ==========================================
        // 1. LOGIKA UNTUK IMPORT EXCEL
        // ==========================================
        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file');

            if (!file) return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });

            const buffer = await file.arrayBuffer();
            const workbook = xlsx.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const dataExcel = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

            let successCount = 0;
            let missingUnitCount = 0;

            for (const row of dataExcel) {
                const npkString = row['NPK'] ? String(row['NPK']).trim() : '';
                const nama = row['NAMA'] ? String(row['NAMA']).trim() : '';
                const unitKerja = row['UNIT KERJA'] ? String(row['UNIT KERJA']).trim() : 'Tanpa Unit Kerja';

                if (!npkString || !nama) continue;
                
                try {
                    let deptId = null;
                    let kompId = null;
                    let dirId = null;

                    // PENCARIAN BERUNTUN: Departemen -> Kompartemen -> Direktorat
                    if (unitKerja !== 'Tanpa Unit Kerja') {
                        const [deptRows] = await db.execute('SELECT id FROM departemen WHERE nama = ? LIMIT 1', [unitKerja]);
                        if (deptRows.length > 0) {
                            deptId = deptRows[0].id;
                        } else {
                            const [kompRows] = await db.execute('SELECT id FROM kompartemen WHERE nama = ? LIMIT 1', [unitKerja]);
                            if (kompRows.length > 0) {
                                kompId = kompRows[0].id;
                            } else {
                                const [dirRows] = await db.execute('SELECT id FROM direktorat WHERE nama = ? LIMIT 1', [unitKerja]);
                                if (dirRows.length > 0) {
                                    dirId = dirRows[0].id;
                                } else {
                                    missingUnitCount++;
                                }
                            }
                        }
                    }

                    const hashedPassword = await bcrypt.hash(`${npkString}123`, 10);
                    const [existing] = await db.execute('SELECT id FROM karyawan WHERE npk = ?', [npkString]);
                    
                    if (existing.length > 0) {
                        await db.execute(
                            'UPDATE karyawan SET nama = ?, departemen_id = ?, kompartemen_id = ?, direktorat_id = ?, unit_kerja = ? WHERE npk = ?',
                            [nama, deptId, kompId, dirId, unitKerja, npkString]
                        );
                    } else {
                        await db.execute(
                            'INSERT INTO karyawan (npk, nama, password, role, is_active, departemen_id, kompartemen_id, direktorat_id, unit_kerja, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
                            [npkString, nama, hashedPassword, 'user', 1, deptId, kompId, dirId, unitKerja]
                        );
                    }
                    successCount++;
                } catch (rowError) {
                    console.error(`Error pada NPK ${npkString}:`, rowError.message);
                }
            }

            let msg = `Berhasil import ${successCount} karyawan.`;
            if (missingUnitCount > 0) {
                msg += ` (Catatan: Ada ${missingUnitCount} karyawan yang nama Unit Kerjanya tidak ditemukan di Database. Mereka disimpan tanpa hierarki).`;
            }

            return NextResponse.json({ message: msg });
        } 
        
        // ==========================================
        // 2. LOGIKA UNTUK TAMBAH MANUAL (SATUAN)
        // ==========================================
        else {
            const { npk, nama, unit_kerja, role } = await request.json();

            if (!npk?.trim() || !nama?.trim()) return NextResponse.json({ error: 'NPK dan Nama wajib diisi' }, { status: 400 });

            const npkUpper = npk.trim().toUpperCase();
            const unitKerjaManual = unit_kerja?.trim() || '';
            const [existing] = await db.execute('SELECT id FROM karyawan WHERE npk = ?', [npkUpper]);
            
            if (existing.length > 0) return NextResponse.json({ error: `NPK ${npkUpper} sudah terdaftar` }, { status: 409 });

            let deptId = null;
            let kompId = null;
            let dirId = null;

            if (unitKerjaManual) {
                const [deptRows] = await db.execute('SELECT id FROM departemen WHERE nama = ? LIMIT 1', [unitKerjaManual]);
                if (deptRows.length > 0) deptId = deptRows[0].id;
                else {
                    const [kompRows] = await db.execute('SELECT id FROM kompartemen WHERE nama = ? LIMIT 1', [unitKerjaManual]);
                    if (kompRows.length > 0) kompId = kompRows[0].id;
                    else {
                        const [dirRows] = await db.execute('SELECT id FROM direktorat WHERE nama = ? LIMIT 1', [unitKerjaManual]);
                        if (dirRows.length > 0) dirId = dirRows[0].id;
                    }
                }
            }

            const hashedPassword = await bcrypt.hash(npkUpper, 10);
            
            await db.execute(
                `INSERT INTO karyawan (npk, nama, unit_kerja, departemen_id, kompartemen_id, direktorat_id, password, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
                [npkUpper, nama.trim(), unitKerjaManual, deptId, kompId, dirId, hashedPassword, role || 'user']
            );

            return NextResponse.json({ success: true, message: 'Karyawan berhasil ditambahkan' });
        }

    } catch (error) {
        console.error('POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}