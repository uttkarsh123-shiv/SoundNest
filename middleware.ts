import { NextRequest, NextResponse } from 'next/server';

// Public API routes that don't need auth
const PUBLIC_API_ROUTES = ['/api/auth', '/api/ai'];

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (!pathname.startsWith('/api/')) return NextResponse.next();

    const isPublic = PUBLIC_API_ROUTES.some(r => pathname.startsWith(r));
    if (isPublic) return NextResponse.next();

    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/:path*'],
};
