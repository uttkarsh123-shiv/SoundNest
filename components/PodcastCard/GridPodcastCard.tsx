import { PodcastCardProps } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Headphones, Heart, Star, Clock } from 'lucide-react'

const GridPodcastCard = ({
    imgUrl,
    title,
    description,
    podcastId,
    views,
    likes,
    rating,
    duration,
    podcastType,
    language
}: PodcastCardProps) => {
    const router = useRouter();

    const formatDuration = (seconds: number) => {
        if (!seconds) return null;

        if (seconds < 60) {
            return `${Math.round(seconds)} sec`;
        } else {
            const minutes = Math.floor(seconds / 60);
            return `${minutes} min`;
        }
    };

    return (
        <div
            className='cursor-pointer rounded-md p-2 hover:bg-white-1/5 transition-colors duration-150 flex flex-col w-full group'
            onClick={() => router.push(`/podcasts/${podcastId}`)}
        >
            <figure className="flex flex-col gap-2 w-full">
                <div className="relative w-full h-[140px] overflow-hidden rounded-md flex-shrink-0">
                    <Image
                        src={imgUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-[11px] font-semibold text-white-1 line-clamp-2 leading-tight">{title}</p>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <h2 className="text-[11px] text-white-3 line-clamp-2 leading-relaxed">{description}</h2>

                    {(views !== undefined || likes !== undefined || rating !== undefined || duration) && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white-1/5">
                            {views !== undefined && (
                                <div className="flex items-center gap-1 text-white-3 text-[10px]">
                                    <Headphones size={10} />
                                    <span>{views}</span>
                                </div>
                            )}
                            {likes !== undefined && (
                                <div className="flex items-center gap-1 text-white-3 text-[10px]">
                                    <Heart size={10} />
                                    <span>{likes}</span>
                                </div>
                            )}
                            {rating !== undefined && (
                                <div className="flex items-center gap-1 text-white-3 text-[10px]">
                                    <Star size={10} />
                                    <span>{rating?.toFixed(1)}</span>
                                </div>
                            )}
                            {duration && (
                                <div className="flex items-center gap-1 text-white-3 text-[10px] ml-auto">
                                    <Clock size={10} />
                                    <span>{formatDuration(duration)}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </figure>
        </div>
    )
}

export default GridPodcastCard