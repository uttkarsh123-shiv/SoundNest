import { PodcastCardProps } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Headphones, Heart, Star } from 'lucide-react'

const PodcastCard = ({
    imgUrl, 
    title, 
    description, 
    podcastId,
    views,
    likes,
    rating
}: PodcastCardProps) => {
    const router = useRouter();

    return (
        <div className='cursor-pointer' onClick={() => router.push(`/podcasts/${podcastId}`)}>
            <figure className="flex flex-col gap-2">
                <Image
                    src={imgUrl}
                    width={174}
                    height={174}
                    alt={title}
                    className="aspect-square h-fit w-full rounded-xl 2xl:size-[150px]"
                />
                <div className="flex flex-col w-full 2xl:w-[150px]">
                    <h1 className="text-16 truncate font-bold text-white-1">{title}</h1>
                    <h2 className="text-12 truncate font-normal capitalize text-white-4">{description}</h2>
                    
                    {/* Stats display */}
                    {(views !== undefined || likes !== undefined || rating !== undefined) && (
                        <div className="flex items-center gap-2 mt-1">
                            {views !== undefined && (
                                <div className="flex items-center gap-1 text-white-3 text-xs">
                                    <Headphones size={12} />
                                    <span>{views}</span>
                                </div>
                            )}
                            {likes !== undefined && (
                                <div className="flex items-center gap-1 text-white-3 text-xs">
                                    <Heart size={12} />
                                    <span>{likes}</span>
                                </div>
                            )}
                            {rating !== undefined && (
                                <div className="flex items-center gap-1 text-white-3 text-xs">
                                    <Star size={12} />
                                    <span>{rating}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </figure>
        </div>
    )
}

export default PodcastCard