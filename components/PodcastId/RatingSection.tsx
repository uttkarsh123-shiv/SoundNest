import { Star } from 'lucide-react';
import DetailSection from './SectionDetail';

interface RatingSectionProps {
    podcast: { ratingCount?: number; averageRating?: number; };
    userRating: number | null;
    hoveredRating: number | null;
    hasRated: boolean;
    ratingDistribution: Record<number, number> | undefined;
    setUserRating: (rating: number) => void;
    setHoveredRating: (rating: number | null) => void;
    setHasRated: (hasRated: boolean) => void;
    handleRatingSubmit: () => void;
}

const RatingSection = ({
    podcast, userRating, hoveredRating, hasRated,
    ratingDistribution, setUserRating, setHoveredRating, setHasRated, handleRatingSubmit
}: RatingSectionProps) => {

    const ratingBadge = podcast?.ratingCount && podcast.ratingCount > 0 ? (
        <div className="flex items-center gap-1.5 bg-black-1/50 px-3 py-1.5 rounded-full">
            <Star size={14} className="fill-green-1 text-green-1" />
            <span className="text-[13px] text-white-2">{podcast.averageRating?.toFixed(1)} ({podcast.ratingCount})</span>
        </div>
    ) : null;

    return (
        <DetailSection title="Rate this Podcast" rightElement={ratingBadge}>
            <div className="flex flex-col gap-5">
                {/* Stars */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setUserRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(null)}
                                className="p-1 transition-transform hover:scale-110"
                                disabled={hasRated}
                            >
                                <Star
                                    size={28}
                                    className={`transition-colors ${(hoveredRating !== null ? star <= hoveredRating : star <= (userRating || 0))
                                        ? "fill-green-1 text-green-1" : "text-white-3"}`}
                                />
                            </button>
                        ))}
                    </div>

                    {!hasRated ? (
                        <button
                            onClick={handleRatingSubmit}
                            disabled={!userRating}
                            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${userRating
                                ? "bg-green-1 text-black hover:bg-green-2"
                                : "bg-white-1/10 text-white-3 cursor-not-allowed"}`}
                        >
                            Submit
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-green-1">Your rating: {userRating} ★</span>
                            <button
                                onClick={() => setHasRated(false)}
                                className="text-xs text-white-3 hover:text-white-1 underline transition-colors"
                            >
                                Modify
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DetailSection>
    );
};

export default RatingSection;
