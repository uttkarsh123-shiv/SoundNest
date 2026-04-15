"use client"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/AuthProvider"
import { useAuthModal } from "@/providers/AuthProvider"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const MobileNav = () => {
  const pathname = usePathname();
  const { user, isSignedIn, signOut } = useAuth();
  const { openModal } = useAuthModal();

  const PROTECTED_ROUTES = ['/create-podcast', '/notification', '/profile', '/admin'];
  const handleNavClick = (e: React.MouseEvent, route: string) => {
    const isProtected = PROTECTED_ROUTES.some(r => route.startsWith(r));
    if (isProtected && !isSignedIn) {
      e.preventDefault();
      openModal('signup');
    }
  };
  const [showTitle, setShowTitle] = useState(false);

  const notifications = useQuery(
    api.notifications.getUserNotifications,
    user?.id ? { userId: user.id } : "skip"
  );
  const hasUnreadNotifications = notifications?.some(n => !n.isRead) || false;

  useEffect(() => {
    const timer = setTimeout(() => setShowTitle(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="sticky top-0 z-50">
      <Sheet>
        <SheetTrigger>
          <Image src="/icons/hamburger.svg" width={28} height={28} alt="menu" className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-black-1 w-[85vw] max-w-[300px] flex flex-col">
          <Link href="/" className="flex cursor-pointer items-center gap-2 pb-6 pl-2 group">
            <Image src="/icons/logo.png" alt="logo" width={32} height={32} className="transition-transform duration-300 group-hover:scale-110" />
            <div className="overflow-hidden">
              <h1 className={cn(
                "text-[24px] font-extrabold ml-1 bg-gradient-to-r from-green-1 to-white-1 bg-clip-text text-transparent transition-all duration-500",
                showTitle ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
              )}>
                SoundNest
              </h1>
            </div>
          </Link>

          <nav className="flex flex-col gap-2 text-white-1 flex-1 overflow-y-auto">
            {sidebarLinks.map(({ route, label, icon: Icon }) => {
              const isProfileRoute = route === "/profile";
              const userProfilePath = user ? `/profile/${user.id}` : "/sign-in";
              const isActive = isProfileRoute
                ? pathname === userProfilePath
                : pathname === route || pathname.startsWith(`${route}/`);
              const isNotificationRoute = route === "/notification";

              return (
                <SheetClose asChild key={route}>
                  <Link
                    href={isProfileRoute ? userProfilePath : route}
                    onClick={(e) => handleNavClick(e, route)}
                    className={cn(
                      "flex gap-3 items-center py-3 px-3 rounded-lg justify-start transition-all duration-200",
                      isActive ? "bg-nav-focus border-r-4 border-green-1 text-green-1" : "hover:bg-black-2/40"
                    )}
                  >
                    <div className="relative">
                      <Icon size={22} className={isActive ? "text-green-1" : "text-white-2"} />
                      {isNotificationRoute && hasUnreadNotifications && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-1" />
                      )}
                    </div>
                    <p className="text-[15px]">{label}</p>
                  </Link>
                </SheetClose>
              );
            })}
          </nav>

          <div className="mt-4 mb-8 px-2">
            {!isSignedIn ? (
              <SheetClose asChild>
                <Button className="text-[14px] w-full bg-green-1 hover:bg-green-2 text-black font-bold rounded-full py-4" onClick={() => openModal('login')}>
                  Sign in
                </Button>
              </SheetClose>
            ) : (
              <SheetClose asChild>
                <Button
                  className="text-[14px] w-full bg-green-1 hover:bg-green-2 text-black font-bold rounded-full py-4"
                  onClick={() => signOut()}
                >
                  Log Out
                </Button>
              </SheetClose>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}

export default MobileNav
