import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth/jwt';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        const user = await convex.query(api.users.getUserByEmail, { email });
        if (!user || !user.passwordHash) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const token = await signToken({
            sub: user._id,
            email: user.email,
            name: user.name,
            imageUrl: user.imageUrl,
            isAdmin: user.isAdmin,
        });

        const res = NextResponse.json({ success: true });
        res.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });
        return res;
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Login failed';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
