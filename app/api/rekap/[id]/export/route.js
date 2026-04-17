import { NextResponse } from 'next/server';
import db from '@/lib/db';
import ExcelJS from 'exceljs';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

const formatDateIndo = (date) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('id-ID', { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
  }).format(date);
};

export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = verifyToken(token);
    
    if (!user) return new Response('Unauthorized', { status: 401 });

    const [karyawanRows] = await db.execute(
      `SELECT nama, npk, unit_kerja FROM karyawan WHERE id = ?`,
      [id]
    );
    
    if (karyawanRows.length === 0) return new Response('Karyawan tidak ditemukan', { status: 404 });
    const karyawan = karyawanRows[0];

    const [kpiRows] = await db.execute(
      `SELECT k.*, a.nama AS nama_approver 
       FROM kamus_kpi k
       LEFT JOIN karyawan a ON k.approved_by = a.id
       WHERE k.dibuat_oleh = ? AND k.status = 'approved' 
       ORDER BY k.created_at ASC`,
      [id]
    );

    // Setup Workbook Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');

    sheet.getColumn('A').width = 5;
    sheet.getColumn('B').width = 55;
    sheet.getColumn('C').width = 12;
    sheet.getColumn('D').width = 12;
    sheet.getColumn('E').width = 15;
    sheet.getColumn('F').width = 15;

    // HEADER DOKUMEN
    sheet.addRow(['Key Performance Indicators']).font = { bold: true, size: 12 };
    sheet.addRow(['Performance Planning']).font = { bold: true, size: 12 };
    sheet.addRow([]);

    sheet.addRow(['Perusahaan', 'PT Pupuk Kalimantan Timur']);
    sheet.addRow(['Nama', karyawan.nama || '-']);
    sheet.addRow(['Badge', karyawan.npk || '-']);
    sheet.addRow(['Jabatan', '-']);
    sheet.addRow(['Unit Kerja', karyawan.unit_kerja || '-']);
    sheet.addRow(['Periode KPI', `Tahun ${new Date().getFullYear()}`]);
    sheet.addRow([]);

    for (let i = 4; i <= 9; i++) {
        sheet.getCell(`A${i}`).font = { bold: true };
    }

    // HEADER TABEL KPI
    const headerRow = sheet.addRow(['No', 'KPI', 'Satuan', 'Target', 'Polaritas', 'Bobot KPI (%)']);
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' }, 
        bottom: { style: 'thin' }, right: { style: 'thin' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // ISI DATA TABEL
    let totalBobot = 0;
    
    kpiRows.forEach((kpi, index) => {
      const bobot = parseFloat(kpi.bobot) || 0; 
      totalBobot += bobot;

      const row = sheet.addRow([
        index + 1,
        kpi.nama_kpi || '-',
        kpi.satuan || '-',
        parseFloat(kpi.target_tahunan) || kpi.target_tahunan || '-',
        kpi.polaritas || '-',
        bobot
      ]);

      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' }, 
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
        cell.alignment = { 
          vertical: 'middle', 
          wrapText: true,
          horizontal: colNumber === 2 ? 'left' : 'center'
        };
      });
    });

    const totalRow = sheet.addRow(['Total Bobot KPI', '', '', '', '', totalBobot]);
    totalRow.font = { bold: true };
    sheet.mergeCells(`A${totalRow.number}:E${totalRow.number}`);
    sheet.getCell(`A${totalRow.number}`).alignment = { horizontal: 'left', vertical: 'middle' };
    
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
        sheet.getCell(`${col}${totalRow.number}`).border = {
            top: { style: 'thin' }, left: { style: 'thin' }, 
            bottom: { style: 'thin' }, right: { style: 'thin' }
        };
    });
    sheet.getCell(`F${totalRow.number}`).alignment = { horizontal: 'center' };

    // FOOTER (OTORISATOR)
    sheet.addRow([]);
    sheet.addRow([]);
    
    const approverName = kpiRows.length > 0 && kpiRows[0].nama_approver ? kpiRows[0].nama_approver : 'Admin';
    const approverJabatan = 'Officer Manaj Kompetensi & Kinerja'; 
    const approvedAt = kpiRows.length > 0 && kpiRows[0].approved_at ? new Date(kpiRows[0].approved_at) : new Date();

    const f1 = sheet.addRow(['', '', '', '', 'Keterangan Otorisator', '']);
    f1.getCell(5).font = { bold: true, underline: true };
    
    const f2 = sheet.addRow(['', '', '', '', 'Dokumen ini telah ditetapkan oleh', approverJabatan]);
    const f3 = sheet.addRow(['', '', '', '', 'Tanggal', formatDateIndo(approvedAt)]);

    // Response File
    const buffer = await workbook.xlsx.writeBuffer();
    const filename = `KPI_Individu_${karyawan.npk || karyawan.nama.replace(/\s+/g, '_')}_${new Date().getFullYear()}.xlsx`;

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Export Excel Error:', error);
    return new Response('Server error: ' + error.message, { status: 500 });
  }
}