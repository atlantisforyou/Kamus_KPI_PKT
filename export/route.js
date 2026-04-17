import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import db from '@/lib/db';
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  HeadingLevel,
} from 'docx';

const border = { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

const BULAN_LABEL = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
const BULAN_KEY   = ['jan','feb','mar','apr','mei','jun','jul','agt','sep','okt','nov','des'];

const formatTgl = (d) => d
  ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
  : '-';

function infoRow(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: 2800, type: WidthType.DXA },
        shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 22, font: 'Arial', color: '374151' })] })],
      }),
      new TableCell({
        borders,
        width: { size: 400, type: WidthType.DXA },
        shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 60, right: 60 },
        children: [new Paragraph({ children: [new TextRun({ text: ':', size: 22, font: 'Arial', color: '6B7280' })] })],
      }),
      new TableCell({
        borders,
        width: { size: 5826, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: String(value ?? '-'), size: 22, font: 'Arial', color: '1F2937' })] })],
      }),
    ],
  });
}

function sectionHeader(text) {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    shading: { fill: '1A2B4A', type: ShadingType.CLEAR },
    children: [new TextRun({ text, bold: true, size: 22, font: 'Arial', color: 'FFFFFF', allCaps: true })],
    indent: { left: 120, right: 120 },
    border: {
      top:    { style: BorderStyle.SINGLE, size: 2, color: '1A2B4A' },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: '1A2B4A' },
      left:   { style: BorderStyle.SINGLE, size: 2, color: '1A2B4A' },
      right:  { style: BorderStyle.SINGLE, size: 2, color: '1A2B4A' },
    },
  });
}

export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user  = verifyToken(token);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const [rows] = await db.execute(
      `SELECT k.*,
              kr.nama AS pembuat_nama, kr.unit_kerja AS pembuat_unit,
              ap.nama AS approver_nama
       FROM kamus_kpi k
       LEFT JOIN karyawan kr ON k.dibuat_oleh = kr.id
       LEFT JOIN karyawan ap ON k.approved_by  = ap.id
       WHERE k.id = ? AND k.status = 'approved'`,
      [id]
    );

    if (rows.length === 0)
      return new Response('KPI tidak ditemukan atau belum diapprove', { status: 404 });

    const k = rows[0];
    const noDoc = `KPI-${String(k.id).padStart(4, '0')}`;

    const targetHeaderCells = BULAN_LABEL.map(b =>
      new TableCell({
        borders,
        width: { size: 750, type: WidthType.DXA },
        shading: { fill: '1A2B4A', type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 60, right: 60 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: b, bold: true, size: 18, font: 'Arial', color: 'FFFFFF' })] })],
      })
    );

    const targetValueCells = BULAN_KEY.map(b =>
      new TableCell({
        borders,
        width: { size: 750, type: WidthType.DXA },
        margins: { top: 60, bottom: 60, left: 60, right: 60 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(k[`target_${b}`] ?? '-'), size: 20, font: 'Arial', color: '1F2937' })] })],
      })
    );

    const targetTable = new Table({
      width: { size: 9026, type: WidthType.DXA },
      columnWidths: Array(12).fill(752),
      rows: [
        new TableRow({ children: targetHeaderCells }),
        new TableRow({ children: targetValueCells }),
      ],
    });

    const doc = new Document({
      styles: {
        default: { document: { run: { font: 'Arial', size: 24 } } },
      },
      sections: [{
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 }, // ~2cm
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 0 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '1A2B4A', space: 6 } },
            children: [
              new TextRun({ text: 'Kamus', bold: true, size: 36, font: 'Arial', color: '1A2B4A' }),
              new TextRun({ text: 'KPI', bold: true, size: 36, font: 'Arial', color: '3B7DD8' }),
              new TextRun({ text: `   |   No. Dokumen: ${noDoc}   |   Tanggal: ${formatTgl(new Date())}`, size: 20, font: 'Arial', color: '6B7280' }),
            ],
          }),
          new Paragraph({ spacing: { after: 200 }, children: [] }),

          // Judul KPI
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [new TextRun({ text: k.nama_kpi || '-', bold: true, size: 36, font: 'Arial', color: '1A2B4A' })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 320 },
            children: [new TextRun({ text: k.sasaran_strategis || '', size: 22, font: 'Arial', color: '6B7280', italics: true })],
          }),

          // Informasi Dasar
          sectionHeader('Informasi Dasar'),
          new Table({
            width: { size: 9026, type: WidthType.DXA },
            columnWidths: [2800, 400, 5826],
            rows: [
              infoRow('Perspektif BSC',    k.perspektif_bsc),
              infoRow('Sasaran Strategis', k.sasaran_strategis),
              infoRow('Nama KPI',          k.nama_kpi),
              infoRow('Definisi KPI',      k.definisi_kpi),
              infoRow('Tujuan KPI',        k.tujuan_kpi),
              infoRow('Dibuat Oleh',       k.pembuat_nama + (k.pembuat_unit ? ` — ${k.pembuat_unit}` : '')),
              infoRow('Tanggal Pengajuan', formatTgl(k.created_at)),
            ],
          }),
          new Paragraph({ spacing: { after: 200 }, children: [] }),

          // Karakteristik
          sectionHeader('Karakteristik KPI'),
          new Table({
            width: { size: 9026, type: WidthType.DXA },
            columnWidths: [2800, 400, 5826],
            rows: [
              infoRow('Tipe KPI',          k.tipe_kpi),
              infoRow('Formula Penilaian', k.formula_penilaian),
              infoRow('Jenis Pengukuran',  k.jenis_pengukuran),
              infoRow('Polaritas',         k.polaritas),
              infoRow('Frekuensi',         k.frekuensi),
              infoRow('Satuan',            k.satuan),
              infoRow('Sumber Data',       k.sumber_data),
              infoRow('Validitas',         k.validitas),
              infoRow('Nilai Maksimum',    k.nilai_maksimum),
            ],
          }),
          new Paragraph({ spacing: { after: 200 }, children: [] }),

          // Target Bulanan
          sectionHeader('Target Bulanan'),
          targetTable,
          new Paragraph({ spacing: { after: 120 }, children: [] }),
          new Table({
            width: { size: 9026, type: WidthType.DXA },
            columnWidths: [3008, 3009, 3009],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    width: { size: 3008, type: WidthType.DXA },
                    shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'Target Tahunan', size: 18, font: 'Arial', color: '6B7280', bold: true })] }),
                      new Paragraph({ children: [new TextRun({ text: `${k.target_tahunan ?? '-'} ${k.satuan || ''}`.trim(), size: 24, font: 'Arial', color: '1A2B4A', bold: true })] }),
                    ],
                  }),
                  new TableCell({
                    borders,
                    width: { size: 3009, type: WidthType.DXA },
                    shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'Satuan', size: 18, font: 'Arial', color: '6B7280', bold: true })] }),
                      new Paragraph({ children: [new TextRun({ text: k.satuan || '-', size: 24, font: 'Arial', color: '1A2B4A', bold: true })] }),
                    ],
                  }),
                  new TableCell({
                    borders,
                    width: { size: 3009, type: WidthType.DXA },
                    shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
                    margins: { top: 80, bottom: 80, left: 120, right: 120 },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'Sumber Data', size: 18, font: 'Arial', color: '6B7280', bold: true })] }),
                      new Paragraph({ children: [new TextRun({ text: k.sumber_data || '-', size: 24, font: 'Arial', color: '1A2B4A', bold: true })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ spacing: { after: 200 }, children: [] }),

          // Info Approval
          sectionHeader('Informasi Persetujuan'),
          new Table({
            width: { size: 9026, type: WidthType.DXA },
            columnWidths: [2800, 400, 5826],
            rows: [
              infoRow('Disetujui Oleh', k.approver_nama),
              infoRow('Tanggal Approval', formatTgl(k.approved_at)),
              ...(k.catatan_approval ? [infoRow('Catatan', k.catatan_approval)] : []),
            ],
          }),
          new Paragraph({ spacing: { after: 400 }, children: [] }),

          // Footer
          new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 2, color: 'E5E7EB', space: 6 } },
            spacing: { before: 120 },
            children: [
              new TextRun({ text: `Dokumen ini digenerate otomatis dari sistem Kamus KPI  |  KPI ID: ${k.id}  |  ${formatTgl(new Date())}`, size: 18, font: 'Arial', color: '9CA3AF', italics: true }),
            ],
          }),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = `KamusKPI-${noDoc}-${k.nama_kpi?.replace(/[^a-zA-Z0-9]/g, '_') || 'export'}.docx`;

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return new Response('Server error: ' + error.message, { status: 500 });
  }
}