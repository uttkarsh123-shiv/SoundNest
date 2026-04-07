import { PodcastCardProps } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Headphones, Heart, Star, Clock } from 'lucide-react'
import { podcastTypes, languageOptions } from '@/constants/PodcastFields'

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
            className='cursor-pointer bg-black-2/50 rounded-lg p-3 hover:bg-black-2/80 transition-all duration-300 h-full flex flex-col w-full border border-white-1/10 hover:border-blue-1/40 hover:shadow-xl hover:shadow-blue-1/10 group backdrop-blur-sm'
            onClick={() => router.push(`/podcasts/${podcastId}`)}
        >
            <figure className="flex flex-col gap-3 h-full w-full">
                <div className="relative w-full aspect-square overflow-hidden rounded-md">
                    <Image
                        src={imgUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black-1/80 via-black-1/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                </div>
                <div className="flex flex-col flex-1 w-full">
                    <h1 className="text-base sm:text-lg font-heading font-semibold text-white-1 line-clamp-1 group-hover:text-blue-1 transition-colors duration-200">{title}</h1>
                    <h2 className="text-xs sm:text-sm font-normal text-white-3 line-clamp-2 mt-1.5 flex-grow leading-relaxed">{description}</h2>

                    {/* Category and language badges */}
                    {(podcastType || language ) && (<div className="flex flex-wrap gap-2 mt-3">
                        {podcastType && (
                            <span className="inline-block bg-blue-1/10 text-blue-1 text-xs px-2.5 py-1 rounded-md border border-blue-1/20 font-medium">
                                {podcastTypes.find(c => c.value === podcastType)?.label || podcastType}
                            </span>
                        )}

                        {language && (
                            <span className="inline-flex items-center bg-white-1/5 text-white-2 text-xs px-2.5 py-1 rounded-md border border-white-1/10 font-medium">
                                {languageOptions.find(l => l.value === language)?.label || language}
                            </span>
                        )}
                    </div>)}

                    {/* Stats display */}
                    {(views !== undefined || likes !== undefined || rating !== undefined || duration) && (
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white-1/5">
                            <div className="flex items-center gap-3">
                                {views !== undefined && (
                                    <div className="flex items-center gap-1.5 text-white-3 text-xs group-hover:text-white-2 transition-colors">
                                        <Headphones size={14} className="flex-shrink-0" />
                                        <span className="font-medium">{views}</span>
                                    </div>
                                )}
                                {likes !== undefined && (
                                    <div className="flex items-center gap-1.5 text-white-3 text-xs group-hover:text-white-2 transition-colors">
                                        <Heart size={14} className="flex-shrink-0" />
                                        <span className="font-medium">{likes}</span>
                                    </div>
                                )}
                                {rating !== undefined && (
                                    <div className="flex items-center gap-1.5 text-white-3 text-xs group-hover:text-white-2 transition-colors">
                                        <Star size={14} className="flex-shrink-0" />
                                        <span className="font-medium">{rating?.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>
                            {duration && (
                                <div className="flex items-center gap-1.5 text-white-3 text-xs group-hover:text-white-2 transition-colors">
                                    <Clock size={14} className="flex-shrink-0" />
                                    <span className="font-medium">{formatDuration(duration)}</span>
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