import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import db from '@/lib/db';

export async function POST(request) {
    try {
        const { nama, npk, password, isAdmin } = await request.json();

        if (isAdmin) {
            if (!nama?.trim() || !password) {
                return NextResponse.json({ error: 'Nama dan Password wajib diisi' }, { status: 400 });
            }
        } else {
            if (!nama?.trim() || !npk?.trim()) {
                return NextResponse.json({ error: 'Nama dan NPK wajib diisi' }, { status: 400 });
            }
        }

        let rows;

        if (isAdmin) {
            [rows] = await db.execute(`SELECT id, npk, nama, password, role, unit_kerja, is_active, departemen_id, kompartemen_id, direktorat_id FROM karyawan WHERE role = 'admin' LIMIT 1`);
        } else {
            [rows] = await db.execute(`SELECT id, npk, nama, password, role, unit_kerja, is_active, departemen_id, kompartemen_id, direktorat_id FROM karyawan WHERE npk = ?`, [npk.trim().toUpperCase()]);
        }

        if (rows.length === 0) {
            return NextResponse.json({ error: isAdmin ? 'Akun Admin tidak ditemukan' : 'NPK tidak ditemukan' }, { status: 401 });
        }

        const karyawan = rows[0];

        if (!karyawan.is_active) {
            return NextResponse.json({ error: 'Akun tidak aktif, hubungi admin' }, { status: 403 });
        }

        if (!isAdmin && karyawan.nama.toLowerCase().trim() !== nama.toLowerCase().trim()) {
            return NextResponse.json({ error: 'Nama tidak sesuai dengan NPK' }, { status: 401 });
        }

        let passwordToVerify;
        
        if (isAdmin) {
            passwordToVerify = password; 
        } else {
            passwordToVerify = npk.trim().toUpperCase(); 
        }

        const passwordValid = await bcrypt.compare(passwordToVerify, karyawan.password);

        if (!passwordValid) {
            return NextResponse.json({ error: isAdmin ? 'Password Admin salah!' : 'Otentikasi Gagal / NPK Tidak Cocok' }, { status: 401 });
        }

        await db.execute('UPDATE karyawan SET last_login = NOW() WHERE id = ?', [karyawan.id]);

        const token = signToken({
            id: karyawan.id,
            npk: karyawan.npk, 
            nama: karyawan.nama,
            role: karyawan.role,
            unit_kerja: karyawan.unit_kerja,
            departemen_id: karyawan.departemen_id,
            kompartemen_id: karyawan.kompartemen_id,
            direktorat_id: karyawan.direktorat_id,
        });

        const redirectMap = {
            user: '/user',
            key_partner: '/key-partner',
            admin: '/admin',
            manajemen: '/manajemen',
        };

        const response = NextResponse.json({
            success: true,
            nama: karyawan.nama,
            role: karyawan.role,
            redirect: redirectMap[karyawan.role],
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 8,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}