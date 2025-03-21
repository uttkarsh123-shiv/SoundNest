import React from 'react'

const LatestPodcastSkeleton = () => {
    return (
        <div className="flex flex-col gap-6">
            {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center p-3 bg-white-1/5 rounded-lg hover:shadow-md hover:shadow-black/20 transition-all duration-300">
                    <span className="inline-block text-center w-8">
                        <div className="h-5 w-5 bg-orange-1/20 rounded-full animate-pulse mx-auto" />
                    </span>
                    <div className="flex flex-col size-full gap-3">
                        <div className="flex justify-between items-center">
                            <figure className="flex items-center gap-3">
                                <div className="w-16 h-16 bg-white-1/10 rounded-lg animate-pulse overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white-1/5 to-transparent"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-5 bg-white-1/10 rounded animate-pulse w-[200px] max-sm:w-[100px]" />
                                    <div className="h-4 bg-white-1/10 rounded animate-pulse w-[150px] max-sm:w-[80px]" />
                                </div>
                            </figure>
                            <div className="flex items-center gap-6">
                                <figure className="flex gap-2 items-center">
                                    <div className="w-5 h-5 rounded-full bg-white-1/10 animate-pulse" />
                                    <div className="h-4 bg-white-1/10 rounded animate-pulse w-[30px]" />
                                </figure>
                                <figure className="flex gap-2 items-center">
                                    <div className="w-5 h-5 rounded-full bg-white-1/10 animate-pulse" />
                                    <div className="h-4 bg-white-1/10 rounded animate-pulse w-[30px]" />
                                </figure>
                                <figure className="flex gap-2 items-center max-sm:hidden">
                                    <div className="w-5 h-5 rounded-full bg-white-1/10 animate-pulse" />
                                    <div className="h-4 bg-white-1/10 rounded animate-pulse w-[60px]" />
                                </figure>
                            </div>
                        </div>
                        <hr className="border-gray-800" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default LatestPodcastSkeleton
