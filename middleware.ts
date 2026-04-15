import { NextRequest, NextResponse } from 'next/server';

// Auth is handled client-side via AuthProvider + modal
// Middleware only blocks unauthenticated API calls (non-auth endpoints)
export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only protect non-auth API routes
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth') && !pathname.startsWith('/api/ai')) {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/:path*'],
};
