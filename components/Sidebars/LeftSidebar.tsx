'use client';

import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { useAudio } from "@/providers/AudioProvider";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const LeftSidebar = () => {
    const { user } = useUser();
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useClerk();
    const { audio } = useAudio();
    
    // Fetch notifications to check for unread ones
    const notifications = useQuery(
        api.notifications.getUserNotifications,
        user?.id ? { userId: user.id } : "skip"
    );
    
    // Check if there are any unread notifications
    const hasUnreadNotifications = notifications?.some(notification => !notification.isRead) || false;

    return (
        <section className={cn("left_sidebar h-[calc(100vh-1px)] transition-all duration-300", {
            'h-[calc(100vh-80px)]': audio?.audioUrl
        })}>
            <nav className='flex flex-col gap-6 w-full'>
                {/* Logo Section */}
                <Link href="/" className="flex cursor-pointer imaktems-center gap-3 pb-3 px-4 max-lg:justify-center max-lg:px-0 group">
                    <div className="relative flex-shrink-0">
                        <Image
                            src="/icons/logo.png"
                            alt="logo"
                            width={50}
                            height={50}
                            className="transition-transform duration-300 group-hover:scale-105 max-lg:w-[55px] max-lg:h-[55px]"
                        />
                    </div>
                    <h1 className="text-[22px] font-extrabold text-white max-lg:hidden bg-gradient-to-r from-blue-1 to-white-1 bg-clip-text text-transparent">
                        SoundNest
                    </h1>
                </Link>

                {/* Navigation Links - Full Width */}
                <div className="flex flex-col space-y-1.5 w-full">
                    {sidebarLinks.map(({ route, label, icon: Icon }) => {
                        // For profile route, check if the current path is the user's profile
                        const isProfileRoute = route === "/profile";
                        const userProfilePath = user ? `/profile/${user.id}` : "/sign-in";

                        // Check if current path is active
                        const isActive = isProfileRoute
                            ? pathname === userProfilePath
                            : pathname === route || pathname.startsWith(`${route}/`);
                            
                        // Check if this is the notification route
                        const isNotificationRoute = route === "/notification";

                        return (
                            <Link
                                href={isProfileRoute ? userProfilePath : route}
                                key={label}
                                className={cn(
                                    "flex gap-4 items-center py-3.5 px-4 transition-all duration-200 w-full group max-lg:justify-center max-lg:px-0",
                                    isActive
                                        ? 'bg-blue-1/10 text-blue-1 border-l-4 border-blue-1 max-lg:border-l-0'
                                        : 'text-white-2 hover:bg-white-1/5 hover:text-white-1 border-l-4 border-transparent max-lg:border-l-0'
                                )}
                            >
                                <div className="relative flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                    <Icon
                                        size={26}
                                        className={cn(
                                            "transition-all",
                                            isActive ? "text-blue-1" : "text-white-2 group-hover:text-white-1"
                                        )}
                                    />
                                    {isNotificationRoute && hasUnreadNotifications && (
                                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-1 ring-2 ring-black-1"></span>
                                    )}
                                </div>
                                <p className="text-[15px] font-medium max-lg:hidden">{label}</p>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Log Out Button - Full Width */}
            <div className="mt-auto px-4 pb-6 max-lg:px-3">
                <SignedOut>
                    <Button
                        asChild
                        className="text-[15px] w-full bg-blue-1 hover:bg-blue-2 font-semibold rounded-xl py-6 transition-all duration-200 shadow-lg hover:shadow-blue-1/20 max-lg:py-3.5"
                    >
                        <Link href="/sign-in" className="max-lg:flex max-lg:items-center max-lg:justify-center">
                            <span className="max-lg:hidden">Sign in</span>
                            <span className="lg:hidden text-base">Log In</span>
                        </Link>
                    </Button>
                </SignedOut>
                <SignedIn>
                    <Button
                        className="text-[15px] w-full bg-blue-1 hover:bg-blue-2 font-semibold rounded-xl py-6 transition-all duration-200 shadow-lg hover:shadow-blue-1/20 max-lg:py-3.5"
                        onClick={() => signOut(() => router.push('/'))}
                    >
                        <span className="max-lg:hidden">Log Out</span>
                        <span className="lg:hidden text-base">Log Out</span>
                    </Button>
                </SignedIn>
            </div>
        </section>
    )
}

export default LeftSidebar