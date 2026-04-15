import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ user: null }, { status: 401 });

    return NextResponse.json({
        user: {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            imageUrl: payload.imageUrl,
            isAdmin: payload.isAdmin,
        }
    });
}
