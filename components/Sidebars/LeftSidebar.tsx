'use client';

import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { useAudio } from "@/providers/AudioProvider";

const LeftSidebar = () => {
    const { user } = useUser();
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useClerk();
    const { audio } = useAudio();

    return (
        <section className={cn("left_sidebar h-[calc(100vh-5px)] transition-all duration-300", {
            'h-[calc(100vh-80px)]': audio?.audioUrl
        })}>
            <nav className='flex flex-col gap-6 w-full'>
                <Link href="/" className="flex cursor-pointer items-center pb-6 max-lg:justify-center group">
                    <div className="relative overflow-hidden rounded-full">
                        <Image
                            src="/icons/logo.png"
                            alt="logo"
                            width={100}
                            height={100}
                            className="transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                    <h1 className="text-[26px] font-extrabold text-white max-lg:hidden bg-gradient-to-r from-orange-1 to-white-1 bg-clip-text text-transparent">PodTales</h1>
                </Link>

                <div className="flex flex-col space-y-1 w-full">
                    {sidebarLinks.map(({ route, label, imgURL }) => {
                        // For profile route, check if the current path is the user's profile
                        const isProfileRoute = route === "/profile";
                        const userProfilePath = user ? `/profile/${user.id}` : "/sign-in";

                        // Check if current path is active
                        const isActive = isProfileRoute
                            ? pathname === userProfilePath // Only active if it's exactly the user's profile
                            : pathname === route || pathname.startsWith(`${route}/`);

                        return (
                            <Link
                                href={isProfileRoute ? userProfilePath : route}
                                key={label}
                                className={cn(
                                    "flex gap-3 items-center py-3 px-4 rounded-lg transition-all duration-200 hover:bg-white-1/5 max-lg:justify-center lg:justify-start w-full",
                                    isActive
                                        ? 'bg-gradient-to-l from-orange-1/20 to-transparent border-r-4 border-orange-1 text-orange-1 font-medium'
                                        : 'text-white-2 hover:text-white-1'
                                )}
                            >
                                <Image
                                    src={imgURL}
                                    alt={label}
                                    width={24}
                                    height={24}
                                    className={cn(
                                        "transition-transform",
                                        isActive ? "scale-110" : ""
                                    )}
                                />
                                <p>{label}</p>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="mt-auto">
                <SignedOut>
                    <div className="flex-center w-full pb-6 max-lg:px-4 lg:pr-8 px-4">
                        <Button
                            asChild
                            className="text-16 w-full bg-orange-1 hover:bg-orange-1/90 font-extrabold rounded-lg py-5 transition-all duration-200 shadow-lg hover:shadow-orange-1/20"
                        >
                            <Link href="/sign-in">Sign in</Link>
                        </Button>
                    </div>
                </SignedOut>
                <SignedIn>
                    <div className="flex-center w-full pb-6 max-lg:px-4 lg:pr-8 px-4">
                        <Button
                            className="text-16 w-full bg-orange-1 hover:bg-orange-1/90 font-extrabold rounded-lg py-5 transition-all duration-200 shadow-lg hover:shadow-orange-1/20"
                            onClick={() => signOut(() => router.push('/'))}
                        >
                            Log Out
                        </Button>
                    </div>
                </SignedIn>
            </div>
        </section>
    )
}

export default LeftSidebar