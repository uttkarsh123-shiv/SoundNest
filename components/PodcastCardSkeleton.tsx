import React from 'react'

const PodcastCardSkeleton = () => {
    return (
        <div className="bg-white-1/5 rounded-xl p-3 border border-white-1/10 shadow-md flex flex-col h-full w-full">
            <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-white-1/10 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-br from-white-1/5 to-transparent"></div>
            </div>
            <div className="flex flex-col flex-1 w-full mt-3 space-y-3">
                <div className="h-5 bg-white-1/10 rounded-md animate-pulse w-4/5" />
                <div className="h-4 bg-white-1/10 rounded-md animate-pulse w-full" />
                <div className="flex items-center gap-3 mt-auto pt-2">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-white-1/10 animate-pulse" />
                        <div className="h-3 bg-white-1/10 rounded-md animate-pulse w-[30px]" />
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-white-1/10 animate-pulse" />
                        <div className="h-3 bg-white-1/10 rounded-md animate-pulse w-[30px]" />
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-white-1/10 animate-pulse" />
                        <div className="h-3 bg-white-1/10 rounded-md animate-pulse w-[30px]" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PodcastCardSkeleton