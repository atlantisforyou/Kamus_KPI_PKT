import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import db from '@/lib/db';
export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        const data = xlsx.utils.sheet_to_json(sheet);

        let insertedCount = 0;

        for (const row of data) {
            const namaKpi = row['Nama KPI'] || row['nama kpi'] || row['nama_kpi'] || '';
            const definisi = row['Definisi'] || row['definisi'] || row['definisi'] || '';
            const tujuan = row['Tujuan'] || row['tujuan'] || row['tujuan'] || '';

            if (namaKpi) {
                await db.query(
                    `INSERT INTO kamus_kpi (nama_kpi, definisi, tujuan) 
                     VALUES (?, ?, ?)`,
                    [namaKpi, definisi, tujuan]
                );
                insertedCount++;
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: `${insertedCount} data Kamus KPI berhasil diimport!` 
        });

    } catch (error) {
        console.error("Error import Excel:", error);
        return NextResponse.json({ error: 'Gagal memproses file Excel' }, { status: 500 });
    }
}