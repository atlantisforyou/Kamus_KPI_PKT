import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

  // Rute publik — tidak perlu token
    if (
        pathname.startsWith('/login') ||
        pathname.startsWith('/api/auth')
    ) {
        return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
    const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
    );

    // Mapping role → prefix URL
    const roleMap = {
        user: '/user',
        key_partner: '/key-partner',
        admin: '/admin',
        manajemen: '/manajemen',
    };

    // Redirect jika akses route bukan miliknya
    for (const [role, prefix] of Object.entries(roleMap)) {
        if (pathname.startsWith(prefix) && payload.role !== role) {
            const myPath = roleMap[payload.role] || '/login';
            return NextResponse.redirect(new URL(myPath, request.url));
        }
    }

    return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};