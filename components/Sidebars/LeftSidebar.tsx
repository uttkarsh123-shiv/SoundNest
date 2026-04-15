'use client';

import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import { useAuth, useAuthModal } from "@/providers/AuthProvider";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAudio } from "@/providers/AudioProvider";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

// Routes that require authentication
const PROTECTED_ROUTES = ['/create-podcast', '/notification', '/profile', '/admin'];

const LeftSidebar = () => {
    const { user, isSignedIn, signOut } = useAuth();
    const { openModal } = useAuthModal();
    const pathname = usePathname();
    const { audio } = useAudio();
    const [collapsed, setCollapsed] = useState(false);

    const notifications = useQuery(
        api.notifications.getUserNotifications,
        user?.id ? { userId: user.id } : "skip"
    );
    const hasUnreadNotifications = notifications?.some(n => !n.isRead) || false;

    const handleNavClick = (e: React.MouseEvent, route: string) => {
        const isProtected = PROTECTED_ROUTES.some(r => route.startsWith(r));
        if (isProtected && !isSignedIn) {
            e.preventDefault();
            openModal('signup');
        }
    };

    return (
        <section className={cn(
            "sticky left-0 top-0 flex flex-col justify-between border-r border-white-1/5 bg-black-1 text-white-1 max-md:hidden transition-all duration-300 overflow-hidden flex-shrink-0",
            collapsed ? "w-[60px]" : "w-[220px]",
            audio?.audioUrl ? "h-[calc(100vh-80px)]" : "h-[calc(100vh-1px)]"
        )}>
            <nav className='flex flex-col w-full'>
                {/* Logo + toggle */}
                <div className="flex items-center justify-between px-3 py-4">
                    {!collapsed ? (
                        <Link href="/" className="flex items-center gap-2 group">
                            <Image src="/icons/logo.png" alt="logo" width={32} height={32} className="transition-transform duration-300 group-hover:scale-105 flex-shrink-0" />
                            <span className="text-[17px] font-extrabold bg-gradient-to-r from-green-1 to-white-1 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
                                SoundNest
                            </span>
                        </Link>
                    ) : (
                        <Link href="/" className="mx-auto">
                            <Image src="/icons/logo.png" alt="logo" width={28} height={28} />
                        </Link>
                    )}
                    <button
                        onClick={() => setCollapsed(p => !p)}
                        className={cn("text-white-3 hover:text-white-1 transition-colors p-1 rounded-md hover:bg-white-1/5 flex-shrink-0", collapsed && "mx-auto mt-2")}
                        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                    </button>
                </div>

                {/* Nav Links */}
                <div className="flex flex-col mt-1 w-full">
                    {sidebarLinks.map(({ route, label, icon: Icon }) => {
                        const isProfileRoute = route === "/profile";
                        const userProfilePath = user ? `/profile/${user.id}` : "/sign-in";
                        const isActive = isProfileRoute
                            ? pathname === userProfilePath
                            : pathname === route || pathname.startsWith(`${route}/`);
                        const isNotificationRoute = route === "/notification";

                        return (
                            <Link
                                href={isProfileRoute ? userProfilePath : route}
                                key={label}
                                title={collapsed ? label : undefined}
                                onClick={(e) => handleNavClick(e, route)}
                                className={cn(
                                    "flex items-center py-2.5 transition-all duration-150 w-full group",
                                    collapsed ? "justify-center px-0" : "gap-3 px-3",
                                    isActive
                                        ? 'text-white-1 border-l-[3px] border-green-1 bg-white-1/5'
                                        : 'text-white-3 hover:text-white-1 border-l-[3px] border-transparent hover:bg-white-1/5'
                                )}
                            >
                                <div className="relative flex-shrink-0 flex items-center justify-center">
                                    <Icon size={20} className={cn("transition-colors", isActive ? "text-white-1" : "text-white-3 group-hover:text-white-1")} />
                                    {isNotificationRoute && hasUnreadNotifications && (
                                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-1" />
                                    )}
                                </div>
                                {!collapsed && <span className="text-[13px] font-semibold">{label}</span>}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Log Out */}
            <div className={cn("pb-4 border-t border-white-1/5 pt-2", collapsed ? "flex justify-center" : "px-3")}>
                {isSignedIn && (
                    <button
                        className={cn(
                            "flex items-center gap-3 text-[13px] font-medium text-white-3 hover:text-white-1 py-2.5 rounded-md hover:bg-white-1/5 transition-all w-full",
                            collapsed ? "justify-center px-0" : "px-3"
                        )}
                        onClick={() => signOut()}
                        title={collapsed ? "Log Out" : undefined}
                    >
                        <span className="text-base leading-none">↩</span>
                        {!collapsed && <span>Log Out</span>}
                    </button>
                )}
            </div>
        </section>
    );
}

export default LeftSidebar
