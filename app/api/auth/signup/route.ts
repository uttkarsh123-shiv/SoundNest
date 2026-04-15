import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth/jwt';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'All fields required' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const userId = await convex.mutation(api.users.createUserWithPassword, {
            email,
            name,
            passwordHash,
            imageUrl: '',
        });

        const token = await signToken({
            sub: userId,
            email,
            name,
            imageUrl: '',
        });

        const res = NextResponse.json({ success: true });
        res.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });
        return res;
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Signup failed';
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
