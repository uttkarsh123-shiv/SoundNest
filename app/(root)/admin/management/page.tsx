"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Check, X } from "lucide-react";
import Image from "next/image";
import { useDebounce } from "@/lib/useDebounce";
import { Id } from "@/convex/_generated/dataModel";

const AdminManagement = () => {
    const { user } = useUser();
    const { toast } = useToast();
    const [userId, setUserId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);


    const createNotification = useMutation(api.notifications.createNotification);

    // Query to search users
    const users = useQuery(api.users.searchUsers, {
        searchTerm: debouncedSearch
    });

    // Query to get admin users
    const adminUsers = useQuery(api.users.getAdminUsers);

    // Query to get admin requests
    const adminRequests = useQuery(api.users.getAdminRequests, {
        status: "pending"
    });

    // Mutation to update admin request status
    const setUserAdmin = useMutation(api.users.setUserAdmin);
    const handleRequestAction = async (requestId: Id<"adminRequests">, userId: string, approved: boolean) => {
        if (!user?.id) return;

        try {
            if (approved) {
                await setUserAdmin({
                    userId: userId,
                    isAdmin: true,
                    requestingUserId: user.id
                });
            }

            // Create notification for the user with request ID
            await createNotification({
                userId: userId,
                type: approved ? "admin_approved" : "admin_rejected",
                message: approved 
                    ? "Your request for admin access has been approved!"
                    : "Your request for admin access has been rejected.",
                creatorId: user.id
            });

            toast({
                title: approved ? "Request Approved" : "Request Rejected",
                description: approved 
                    ? "User has been granted admin privileges" 
                    : "Admin request has been rejected",
                duration: 3000,
            });
        } catch (error) {
            console.error("Error handling admin request:", error);
            toast({
                title: "Error processing request",
                description: error instanceof Error ? error.message : "Please try again",
                variant: "destructive",
                duration: 3000,
            });
        }
    };

    const handleRemoveAdmin = async (adminId: string) => {
        if (!user?.id) return;

        try {
            await setUserAdmin({
                userId: adminId,
                isAdmin: false,
                requestingUserId: user.id
            });

            toast({
                title: "Admin removed",
                description: "User's admin privileges have been revoked",
                duration: 3000,
            });
        } catch (error) {
            console.error("Error removing admin:", error);
            toast({
                title: "Error removing admin",
                description: error instanceof Error ? error.message : "Please try again",
                variant: "destructive",
                duration: 3000,
            });
        }
    };

    const handleAddAdmin = async () => {
        if (!userId.trim() || !user?.id) return;

        try {
            await setUserAdmin({
                userId: userId.trim(),
                isAdmin: true,
                requestingUserId: user.id
            });

            toast({
                title: "Admin added",
                description: "User has been granted admin privileges",
                duration: 3000,
            });

            // Reset both userId and searchTerm
            setUserId("");
            setSearchTerm("");
        } catch (error) {
            console.error("Error adding admin:", error);
            toast({
                title: "Error adding admin",
                description: error instanceof Error ? error.message : "Please try again",
                variant: "destructive",
                duration: 3000,
            });
        }
    };

    const handleUserSelect = (selectedUser: { clerkId: string; name: string }) => {
        setUserId(selectedUser.clerkId);
        setSearchTerm(selectedUser.name + ' (' + selectedUser.clerkId + ')');
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-6 text-white-1">Admin Management</h2>

            {/* Admin Requests Section */}
            {adminRequests && adminRequests.length > 0 && (
                <div className="bg-black-1/30 border border-gray-800 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-white-1 mb-4">Pending Admin Requests</h3>
                    <div className="space-y-4">
                        {adminRequests.map((request) => (
                            <div
                                key={request._id}
                                className="bg-black-1/50 p-4 rounded-lg border border-gray-800"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-white-1 font-medium">{request.userId}</p>
                                        <p className="text-white-3 text-sm mt-1 line-clamp-2">{request.reason}</p>
                                        <p className="text-white-3 text-xs mt-2">
                                            Requested on: {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRequestAction(request._id, request.userId, true)}
                                            className="bg-green-500/20 text-green-500 hover:bg-green-500/30"
                                        >
                                            <Check size={18} className="mr-1" />
                                            Approve
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRequestAction(request._id, request.userId, false)}
                                            className="bg-red-500/20 text-red-500 hover:bg-red-500/30"
                                        >
                                            <X size={18} className="mr-1" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Current Admins Section */}
            <div className="bg-black-1/30 border border-gray-800 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white-1 mb-4">Current Admins</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adminUsers?.map((admin) => (
                        <div
                            key={admin.clerkId}
                            className="relative bg-black-1/50 p-3 rounded-lg border border-gray-800"
                        >
                            {user?.id !== admin.clerkId && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveAdmin(admin.clerkId)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-600 p-0 h-6 w-6 transition-colors hover:bg-transparent"
                                >
                                    <Trash2 size={14} />
                                </Button>
                            )}
                            <div className="flex items-center gap-3">
                                <Image
                                    src={admin.imageUrl}
                                    alt={admin.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <div>
                                    <p className="text-white-1 font-medium text-sm">{admin.name}</p>
                                    <p className="text-white-3 text-xs">{admin.email}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add New Admin Section */}
            <div className="bg-black-1/30 border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white-1 mb-4">Add New Admin</h3>

                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <Input
                            placeholder="Search user by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-black-1/50 border border-gray-800 text-white-2"
                        />

                        {users && users.length > 0 && searchTerm && (
                            <div className="absolute z-10 w-full mt-1 bg-black-1 border border-gray-800 rounded-lg max-h-60 overflow-y-auto">
                                {users.map((user) => (
                                    <div
                                        key={user.clerkId}
                                        className="flex items-center gap-3 p-2 hover:bg-black-2 cursor-pointer"
                                        onClick={() => handleUserSelect(user)}
                                    >
                                        <Image
                                            src={user.imageUrl}
                                            alt={user.name}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <p className="text-white-1 text-sm font-medium">{user.name}</p>
                                            <p className="text-white-3 text-xs">{user.clerkId}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={handleAddAdmin}
                        disabled={!userId.trim()}
                        className="bg-orange-1 text-black hover:bg-orange-2"
                    >
                        Add Admin
                    </Button>
                </div>

                <p className="text-white-3 text-sm mt-2">
                    Note: Search for a user by their name or Clerk ID to grant them admin privileges.
                </p>
            </div>
        </div>
    );
};

export default AdminManagement;