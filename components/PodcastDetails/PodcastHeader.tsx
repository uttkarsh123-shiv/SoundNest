import { Clock, Headphones, Layers, Star } from 'lucide-react';

interface PodcastHeaderProps {
  podcastType: string | undefined;
  audioDuration: number;
  views: number;
  averageRating: number | undefined;
}

const PodcastHeader = ({ podcastType, audioDuration, views, averageRating }: PodcastHeaderProps) => {
  return (
    <header className="mt-9 flex items-center justify-between bg-black-1/30 p-6 rounded-xl border border-gray-800">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
        <h1 className="text-24 font-bold text-white-1">
          Currently Playing
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Category */}
        <div className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full">
          <Layers size={20} stroke="white" />
          <span className="text-14 font-medium text-white-2 capitalize">{podcastType || "storytelling"}</span>
        </div>
        {/* Duration */}
        <div className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full">
          <Clock size={20} stroke="white" />
          <span className="text-14 font-medium text-white-2">
            {Math.floor(audioDuration / 60)}:{Math.floor(audioDuration % 60).toString().padStart(2, '0')}
          </span>
        </div>
        {/* Views */}
        <div className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full">
          <Headphones size={20} stroke="white" />
          <span className="text-14 font-medium text-white-2">{views} views</span>
        </div>
        {/* Rating */}
        <div className="flex items-center gap-2 bg-black-1/50 px-4 py-2 rounded-full">
          <Star size={20} stroke="white" fill={averageRating ? "orange" : "none"} />
          <span className="text-14 font-medium text-white-2">
            {averageRating ? averageRating.toFixed(1) : "No ratings"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default PodcastHeader;