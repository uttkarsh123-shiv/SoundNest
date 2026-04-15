'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useAuthModal } from '@/providers/AuthProvider';

export default function AuthModal() {
    const { isOpen, closeModal, defaultTab } = useAuthModal();
    const [tab, setTab] = useState<'login' | 'signup'>(defaultTab || 'login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { refreshUser } = useAuthModal();

    if (!isOpen) return null;

    const reset = () => { setName(''); setEmail(''); setPassword(''); setError(''); };

    const switchTab = (t: 'login' | 'signup') => { setTab(t); reset(); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/signup';
            const body = tab === 'login' ? { email, password } : { name, email, password };
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error); return; }
            await refreshUser();
            closeModal();
        } catch {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />

            {/* modal */}
            <div className="relative z-10 w-full max-w-[400px] mx-4 bg-black-2 rounded-xl border border-white-1/10 p-8 shadow-2xl">
                <button onClick={closeModal} className="absolute top-4 right-4 text-white-3 hover:text-white-1 transition-colors">
                    <X size={20} />
                </button>

                {/* logo + title */}
                <div className="flex flex-col items-center mb-6">
                    <Image src="/icons/logo.png" alt="SoundNest" width={48} height={48} />
                    <h2 className="text-xl font-extrabold text-white-1 mt-3 tracking-tight">
                        {tab === 'login' ? 'Log in to SoundNest' : 'Sign up for free'}
                    </h2>
                </div>

                {/* tabs */}
                <div className="flex rounded-full bg-black-1 p-1 mb-6">
                    <button
                        onClick={() => switchTab('login')}
                        className={`flex-1 text-[13px] font-semibold py-1.5 rounded-full transition-all ${tab === 'login' ? 'bg-green-1 text-black' : 'text-white-3 hover:text-white-1'}`}
                    >
                        Log in
                    </button>
                    <button
                        onClick={() => switchTab('signup')}
                        className={`flex-1 text-[13px] font-semibold py-1.5 rounded-full transition-all ${tab === 'signup' ? 'bg-green-1 text-black' : 'text-white-3 hover:text-white-1'}`}
                    >
                        Sign up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {tab === 'signup' && (
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-white-3 uppercase tracking-widest">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                onKeyDown={e => e.stopPropagation()}
                                required
                                className="input-class px-4 py-2.5 text-sm"
                                placeholder="Your name"
                            />
                        </div>
                    )}
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-white-3 uppercase tracking-widest">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.stopPropagation()}
                            required
                            className="input-class px-4 py-2.5 text-sm"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-white-3 uppercase tracking-widest">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.stopPropagation()}
                            required
                            minLength={6}
                            className="input-class px-4 py-2.5 text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-1 w-full bg-green-1 hover:bg-green-2 text-black font-bold rounded-full py-2.5 text-sm transition-all disabled:opacity-50"
                    >
                        {loading ? '...' : tab === 'login' ? 'Log In' : 'Create account'}
                    </button>
                </form>

                <p className="text-center text-[12px] text-white-3 mt-4">
                    {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        onClick={() => switchTab(tab === 'login' ? 'signup' : 'login')}
                        className="text-white-1 font-semibold hover:text-green-1 transition-colors"
                    >
                        {tab === 'login' ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
    );
}
