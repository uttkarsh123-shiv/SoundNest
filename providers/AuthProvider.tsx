'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    imageUrl: string;
    isAdmin?: boolean;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoaded: boolean;
    isSignedIn: boolean;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

interface AuthModalContextType {
    isOpen: boolean;
    defaultTab: 'login' | 'signup';
    openModal: (tab?: 'login' | 'signup') => void;
    closeModal: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [defaultTab, setDefaultTab] = useState<'login' | 'signup'>('login');
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setIsLoaded(true);
        }
    };

    useEffect(() => { fetchUser(); }, []);

    const signOut = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/');
    };

    const openModal = (tab: 'login' | 'signup' = 'login') => {
        setDefaultTab(tab);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    return (
        <AuthContext.Provider value={{ user, isLoaded, isSignedIn: !!user, signOut, refreshUser: fetchUser }}>
            <AuthModalContext.Provider value={{ isOpen: modalOpen, defaultTab, openModal, closeModal, refreshUser: fetchUser }}>
                {children}
            </AuthModalContext.Provider>
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}

export function useAuthModal() {
    const ctx = useContext(AuthModalContext);
    if (!ctx) throw new Error('useAuthModal must be used inside AuthProvider');
    return ctx;
}
