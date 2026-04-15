import { Mic, Users, User, Headphones, Heart, Star } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";

interface ProfileHeaderProps {
    user: {
        name?: string;
        imageUrl?: string;
        isVerified?: boolean;
    };
    podcastCount: number;
    totalViews: number;
    totalLikes: number;
    averageRating: string;
    isFollowing: boolean;
    followersCount: number | undefined;
    followingCount: number | undefined;
}

const ProfileHeader = ({
    user,
    podcastCount,
    totalViews,
    totalLikes,
    averageRating,
    followersCount,
    followingCount,
}: ProfileHeaderProps) => {
    return (
        <div className="relative w-full rounded-xl overflow-hidden mb-6">
            {/* Banner */}
            <div className="h-40 sm:h-52 bg-gradient-to-br from-green-1/20 via-purple-700/20 to-black-1 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black-3 via-black-3/60 to-transparent" />
            </div>

            {/* Profile content */}
            <div className="relative px-5 sm:px-8 pb-6 -mt-16 flex flex-col sm:flex-row sm:items-end gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <UserAvatar
                        name={user?.name || '?'}
                        imageUrl={user?.imageUrl}
                        size={96}
                        className="ring-4 ring-black-3 shadow-xl"
                    />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-1">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white-1 tracking-tight">
                                {user?.name || "User"}
                            </h1>
                            {user?.isVerified && (
                                <span className="text-[10px] font-bold bg-green-1 text-black px-2 py-0.5 rounded-full">✓ Verified</span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-[13px] text-white-3">
                            <span className="flex items-center gap-1.5">
                                <Mic size={13} className="text-green-1" />
                                {podcastCount} {podcastCount === 1 ? 'Podcast' : 'Podcasts'}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <User size={13} className="text-green-1" />
                                {followersCount ?? 0} Followers
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Users size={13} className="text-green-1" />
                                {followingCount ?? 0} Following
                            </span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-3">
                        {[
                            { icon: <Headphones size={15} />, value: totalViews.toLocaleString(), label: "Views" },
                            { icon: <Heart size={15} />, value: totalLikes.toLocaleString(), label: "Likes" },
                            { icon: <Star size={15} />, value: averageRating, label: "Rating" },
                        ].map(s => (
                            <div key={s.label} className="flex flex-col items-center bg-white-1/5 border border-white-1/10 rounded-lg px-3 py-2 min-w-[64px]">
                                <span className="text-green-1">{s.icon}</span>
                                <span className="text-base font-bold text-white-1 mt-0.5">{s.value}</span>
                                <span className="text-[10px] text-white-3">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
