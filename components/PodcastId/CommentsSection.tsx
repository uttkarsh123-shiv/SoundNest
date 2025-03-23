import { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import DetailSection from './SectionDetail';
import { Id } from '@/convex/_generated/dataModel';
import { UserResource } from '@clerk/types';

// Update User interface to match UserResource properties
interface User {
    id: string;
    imageUrl: string;
    fullName?: string | null; // Changed to accept null
    username?: string | null; // Changed to accept null
}

interface Comment {
    _id: Id<"comments">;
    userId: string;
    userName: string;
    userImageUrl: string;
    content: string;
    _creationTime: number;
}

interface CommentsSectionProps {
    user: UserResource | User | null | undefined;  // Accept both UserResource and User
    podcastComments: Comment[] | undefined;
    comment: string;
    isOwner: boolean;
    setComment: (comment: string) => void;
    handleCommentSubmit: () => void;
    handleCommentDelete: (commentId: Id<"comments">) => void;
}

const CommentsSection = ({
    user,
    podcastComments,
    comment,
    isOwner,
    setComment,
    handleCommentSubmit,
    handleCommentDelete
}: CommentsSectionProps) => {
    const [showComments, setShowComments] = useState(false);

    return (
        <DetailSection
            title="Comments"
            rightElement={
                podcastComments && podcastComments.length > 0 ? (
                    <span className="text-14 text-white-3 bg-black-1/50 px-3 py-1 rounded-full">
                        {podcastComments.length}
                    </span>
                ) : null
            }
        >
            {/* Add Comment Form */}
            {user && (
                <div className="mb-6">
                    <div className="flex gap-4 bg-black-1/50 p-4 rounded-lg border border-gray-800">
                        <div className="flex-shrink-0 relative w-10 h-10">
                            <Image
                                src={user.imageUrl}
                                alt={user.fullName || "User"}
                                className="rounded-full object-cover"
                                fill
                                sizes="40px"
                            />
                        </div>
                        <div className="flex-grow">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === ' ') {
                                        e.stopPropagation();
                                    }
                                }}
                                placeholder="Share your thoughts about this podcast..."
                                className="w-full bg-black-1/70 border border-gray-800 rounded-lg p-3 text-white-2 placeholder:text-white-3 focus:outline-none focus:ring-1 focus:ring-orange-1 min-h-[100px]"
                            />
                            <div className="flex justify-end mt-3">
                                <button
                                    onClick={handleCommentSubmit}
                                    disabled={!comment.trim()}
                                    className={`px-5 py-2 rounded-lg font-medium transition-all ${comment.trim()
                                        ? "bg-orange-1 text-black hover:bg-orange-2"
                                        : "bg-white-1/10 text-white-3 cursor-not-allowed"
                                        }`}
                                >
                                    Post Comment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Show Comments Toggle */}
            {podcastComments && podcastComments.length > 0 ? (
                <div className="flex justify-center mb-4">
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 bg-black-1/50 px-5 py-2 rounded-full hover:bg-white-1/10 transition-colors"
                    >
                        {showComments ? (
                            <>
                                <ChevronUp size={18} stroke="white" />
                                <span className="text-14 font-medium text-white-2">Hide Comments</span>
                            </>
                        ) : (
                            <>
                                <ChevronDown size={18} stroke="white" />
                                <span className="text-14 font-medium text-white-2">Show {podcastComments.length} Comments</span>
                            </>
                        )}
                    </button>
                </div>
            ) : (
                !user && (
                    <div className="text-center py-8 bg-black-1/50 rounded-lg border border-gray-800">
                        <MessageCircle size={40} className="mx-auto mb-3 text-white-3" />
                        <p className="text-white-3">No comments yet. Sign in to be the first to comment!</p>
                    </div>
                )
            )}

            {/* Comments List */}
            {showComments && (
                <div className="space-y-6">
                    {podcastComments && podcastComments.length > 0 ? (
                        podcastComments.map((comment) => (
                            <div key={comment._id} className="flex gap-4 bg-black-1/50 p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                                <div className="flex-shrink-0 relative w-10 h-10">
                                    <Image
                                        src={comment.userImageUrl}
                                        alt={comment.userName}
                                        className="rounded-full object-cover"
                                        fill
                                        sizes="40px"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-16 font-medium text-white-1">{comment.userName}</h4>
                                            <span className="text-12 text-white-3">
                                                {new Date(comment._creationTime).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        {user && (user.id === comment.userId || isOwner) && (
                                            <button
                                                onClick={() => handleCommentDelete(comment._id)}
                                                className="text-white-3 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-white-1/10"
                                                title="Delete comment"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-15 text-white-2">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 bg-black-1/50 rounded-lg border border-gray-800">
                            <MessageCircle size={40} className="mx-auto mb-3 text-white-3" />
                            <p className="text-white-3">No comments yet. Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            )}
        </DetailSection>
    );
};

export default CommentsSection;