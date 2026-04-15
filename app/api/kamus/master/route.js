import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        nama_kpi, 
        definisi_kpi, 
        tujuan_kpi, 
        tipe_kpi, 
        formula_penilaian, 
        jenis_pengukuran, 
        polaritas, 
        frekuensi, 
        sumber_data, 
        satuan, 
        validitas
      FROM kamus_kpi
      GROUP BY nama_kpi
      ORDER BY nama_kpi ASC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching master KPI:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}