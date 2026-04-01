require('dotenv').config({ path: '.env.local' });

const XLSX = require('xlsx');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// ─── KONFIGURASI ─────────────────────────────────────────────

// Ganti nama file sesuai file Excel kamu jika berbeda
const EXCEL_FILE = path.join(__dirname, '../data/karyawan.xlsx');
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');

// ─── WARNA TERMINAL ──────────────────────────────────────────
const c = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
};

// ─── MAIN ────────────────────────────────────────────────────
async function main() {
    console.log('\n' + c.bold + c.blue + '━'.repeat(50) + c.reset);
    console.log(c.bold + '  🚀 Import Karyawan dari Excel' + c.reset);
    console.log(c.blue + '━'.repeat(50) + c.reset + '\n');

  // 1. Cek file Excel ada
    if (!fs.existsSync(EXCEL_FILE)) {
        console.error(c.red + `❌ File tidak ditemukan: ${EXCEL_FILE}` + c.reset);
        console.log(c.yellow + '\nPastikan:' + c.reset);
        console.log('  1. Buat folder "data" di root project');
        console.log('  2. Taruh file Excel dengan nama "karyawan.xlsx"');
        console.log('  3. Atau ubah nama file di baris EXCEL_FILE di script ini\n');
        process.exit(1);
    }

    console.log(c.dim + `📄 File: ${EXCEL_FILE}` + c.reset);

  // 2. Baca file Excel
    const workbook = XLSX.readFile(EXCEL_FILE);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    console.log(c.dim + `📊 Sheet: "${sheetName}" | Total baris data: ${rows.length}` + c.reset + '\n');

    if (rows.length === 0) {
        console.error(c.red + '❌ File Excel kosong atau format tidak sesuai' + c.reset);
        process.exit(1);
    }

  // 3. Koneksi ke MySQL
    let db;
    try {
    db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'kamus_kpi',
        timezone: '+07:00',
    });
    console.log(c.green + '✅ Koneksi database berhasil\n' + c.reset);
    } catch (err) {
        console.error(c.red + '❌ Koneksi database gagal:' + c.reset, err.message);
        console.log(c.yellow + '\nPastikan .env.local sudah diisi dengan benar' + c.reset + '\n');
        process.exit(1);
    }

  // 4. Proses tiap baris
    let berhasil = 0;
    let diperbarui = 0;
    let dilewati = 0;
    const errors = [];

    console.log('⏳ Memproses data...\n');

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNum = i + 2; // +2 karena baris 1 = header

        // Baca kolom (toleran terhadap variasi penulisan)
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

        // Validasi
        if (!npk) {
        errors.push(`Baris ${rowNum}: Kolom NPK kosong`);
        dilewati++;
        process.stdout.write(c.red + '✗' + c.reset);
        continue;
        }
        if (!nama) {
        errors.push(`Baris ${rowNum}: Kolom NAMA kosong (NPK: ${npk})`);
        dilewati++;
        process.stdout.write(c.red + '✗' + c.reset);
        continue;
        }

        try {
        // Hash NPK sebagai password
        const hashedPassword = await bcrypt.hash(npk, SALT_ROUNDS);

        // Cek apakah NPK sudah ada
        const [existing] = await db.execute(
            'SELECT id FROM karyawan WHERE npk = ?', [npk]
        );

        if (existing.length > 0) {
            // Update — jangan ubah role
            await db.execute(
            'UPDATE karyawan SET nama = ?, unit_kerja = ?, password = ? WHERE npk = ?',
            [nama, unit_kerja, hashedPassword, npk]
            );
            diperbarui++;
            process.stdout.write(c.yellow + '↑' + c.reset);
        } else {
            // Insert baru dengan role default 'user'
            await db.execute(
            `INSERT INTO karyawan (npk, nama, unit_kerja, password, role) VALUES (?, ?, ?, ?, 'user')`,
            [npk, nama, unit_kerja, hashedPassword]
            );
            berhasil++;
            process.stdout.write(c.green + '✓' + c.reset);
        }
        } catch (err) {
        errors.push(`Baris ${rowNum} (NPK: ${npk}): ${err.message}`);
        dilewati++;
        process.stdout.write(c.red + '✗' + c.reset);
        }
    }

  // 5. Tampilkan hasil
    console.log('\n\n' + c.bold + '━'.repeat(50) + c.reset);
    console.log(c.bold + '  📋 HASIL IMPORT' + c.reset);
    console.log('━'.repeat(50));
    console.log(c.green  + `  ✓ Data baru      : ${berhasil}` + c.reset);
    console.log(c.yellow + `  ↑ Diperbarui     : ${diperbarui}` + c.reset);
    console.log(c.red    + `  ✗ Dilewati       : ${dilewati}` + c.reset);
    console.log(         `  ─ Total diproses : ${berhasil + diperbarui + dilewati}`);
    console.log('━'.repeat(50));

    if (errors.length > 0) {
        console.log('\n' + c.yellow + '⚠️  Baris yang dilewati:' + c.reset);
        errors.forEach(e => console.log(c.dim + '   • ' + e + c.reset));
    }

    console.log('\n' + c.green + c.bold + '✅ Import selesai!' + c.reset);
    console.log(c.dim + '   Karyawan dapat login dengan Nama + NPK masing-masing\n' + c.reset);

    await db.end();
}

main().catch((err) => {
    console.error(c.red + '\n❌ Error tidak terduga:' + c.reset, err);
    process.exit(1);
});