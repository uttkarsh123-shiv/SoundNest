'use client';

import { ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';
import { ConvexProvider } from 'convex/react';
import { AuthProvider } from './AuthProvider';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function AppProvider({ children }: { children: ReactNode }) {
    return (
        <ConvexProvider client={convex}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ConvexProvider>
    );
}
