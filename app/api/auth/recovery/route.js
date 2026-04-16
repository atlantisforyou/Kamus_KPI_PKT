import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 25060,
  ssl: {
    rejectUnauthorized: false
  }
};

export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    const { action, email, otp, newPassword } = body;

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }

    connection = await mysql.createConnection(dbConfig);

    switch (action) {
      case 'request_otp':
        const [cekUser] = await connection.execute('SELECT id, nama FROM karyawan WHERE email = ?', [email]);
        if (cekUser.length === 0) {
          return NextResponse.json({ error: "Email tidak terdaftar" }, { status: 404 });
        }

        const user = cekUser[0];
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        await connection.execute('UPDATE karyawan SET otp = ? WHERE email = ?', [otpCode, email]);

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        const mailOptions = {
          from: `"Kamus KPI" <${process.env.SMTP_EMAIL}>`,
          to: email,
          subject: 'Kode OTP Reset Password',
          html: `
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e5eaf0; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #1a2b4a; padding: 20px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0;">Reset Password</h2>
              </div>
              <div style="padding: 30px; background-color: #ffffff;">
                <p style="color: #374151; font-size: 15px;">Halo <strong>${user.nama || 'Karyawan'}</strong>,</p>
                <p style="color: #7a8b9a; font-size: 14px; line-height: 1.6;">
                  Kami menerima permintaan untuk mereset password akun kamu. Berikut adalah kode OTP kamu:
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 6px; padding: 15px 30px; background-color: #f4f6f9; border-radius: 8px;">
                    ${otpCode}
                  </span>
                </div>
                
                <p style="color: #dc2626; font-size: 13px; text-align: center;">
                  <em>Kode ini bersifat rahasia. Jangan berikan kode ini ke siapapun.</em>
                </p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "OTP berhasil dikirim ke email" }, { status: 200 });

      case 'verify_otp':
        if (!otp) return NextResponse.json({ error: "OTP wajib diisi" }, { status: 400 });
        
        const [cekOtp] = await connection.execute('SELECT id FROM karyawan WHERE email = ? AND otp = ?', [email, otp]);
        if (cekOtp.length === 0) {
          return NextResponse.json({ error: "Kode OTP salah atau kedaluwarsa" }, { status: 400 });
        }
        return NextResponse.json({ message: "OTP Valid" }, { status: 200 });

      // RESET PASSWORD BARU
      case 'reset_password':
        if (!otp || !newPassword) {
          return NextResponse.json({ error: "OTP dan Password baru wajib diisi" }, { status: 400 });
        }

        const [validasiAkhir] = await connection.execute('SELECT id FROM karyawan WHERE email = ? AND otp = ?', [email, otp]);
        if (validasiAkhir.length === 0) {
          return NextResponse.json({ error: "Sesi OTP tidak valid" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await connection.execute('UPDATE karyawan SET password = ?, otp = NULL WHERE email = ?', [hashedPassword, email]);

        return NextResponse.json({ message: "Password berhasil diperbarui" }, { status: 200 });

      default:
        return NextResponse.json({ error: "Action tidak dikenal" }, { status: 400 });
    }

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}