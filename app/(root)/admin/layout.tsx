"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LoaderSpinner from "@/components/LoaderSpinner";
import Navigation from "@/components/Admin/Navigation";
import RequestAdminAccess from "@/components/Admin/RequestAdminAccess";
import UserAvatar from "@/components/ui/UserAvatar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useAuth();
    const [isChecking, setIsChecking] = useState(true);

    const isAdmin = useQuery(
        api.users.isUserAdmin,
        user?.id ? { userId: user.id } : "skip"
    );

    useEffect(() => {
        if (isLoaded && isAdmin !== undefined) setIsChecking(false);
    }, [user, isLoaded, isAdmin]);

    if (isChecking || !isLoaded || isAdmin === undefined) {
        return <div className="flex items-center justify-center h-full"><LoaderSpinner /></div>;
    }

    if (!isAdmin && user) {
        return <RequestAdminAccess userId={user.id} />;
    }

    return (
        <div className="max-md:min-h-[calc(100vh-135px)] min-h-[calc(100vh-85px)]">
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-white-1">Admin Portal</h1>
                    {user && (
                        <div className="flex items-center gap-3">
                            <UserAvatar name={user.name} imageUrl={user.imageUrl} size={36} />
                            <div>
                                <p className="text-white-1 text-sm font-medium">{user.name}</p>
                                <p className="text-white-3 text-xs">Administrator</p>
                            </div>
                        </div>
                    )}
                </div>
                <Navigation />
                <div className="bg-black-1/20 rounded-xl border border-white-1/5 p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
