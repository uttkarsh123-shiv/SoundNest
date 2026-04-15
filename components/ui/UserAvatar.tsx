'use client';

import Image from 'next/image';

const COLORS = [
    '#1DB954', // green
    '#8B0000', // maroon
    '#E91E8C', // pink
    '#FF6B35', // orange
    '#7B2FBE', // purple
    '#0077B6', // blue
    '#D4A017', // gold
    '#2E8B57', // sea green
];

function getColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return COLORS[Math.abs(hash) % COLORS.length];
}

interface UserAvatarProps {
    name: string;
    imageUrl?: string | null;
    size?: number;
    className?: string;
}

export default function UserAvatar({ name, imageUrl, size = 36, className = '' }: UserAvatarProps) {
    const letter = (name || '?')[0].toUpperCase();
    const bg = getColor(name || '?');

    if (imageUrl && !imageUrl.includes('dicebear')) {
        return (
            <Image
                src={imageUrl}
                alt={name}
                width={size}
                height={size}
                className={`rounded-full object-cover flex-shrink-0 ${className}`}
                style={{ width: size, height: size }}
            />
        );
    }

    return (
        <div
            className={`rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white select-none ${className}`}
            style={{ width: size, height: size, background: bg, fontSize: size * 0.4 }}
        >
            {letter}
        </div>
    );
}
