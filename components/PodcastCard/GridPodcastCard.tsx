import { PodcastCardProps } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const GridPodcastCard = ({ imgUrl, title, description, podcastId }: PodcastCardProps) => {
    const router = useRouter();

    return (
        <div
            className='cursor-pointer rounded-lg p-3 hover:bg-white-1/5 transition-colors duration-150 flex flex-col gap-3 w-full'
            onClick={() => router.push(`/podcasts/${podcastId}`)}
        >
            <div className="relative w-full aspect-square overflow-hidden rounded-md shadow-md flex-shrink-0">
                <Image
                    src={imgUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col gap-0.5">
                <p className="text-[13px] font-bold text-white-1 line-clamp-1">{title}</p>
                <p className="text-[11px] text-white-3 line-clamp-2 leading-snug">{description}</p>
            </div>
        </div>
    )
}

export default GridPodcastCard
