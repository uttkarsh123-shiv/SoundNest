import React from 'react'

const FeaturedSkeleton = () => {
    return (
        <section className="relative w-full h-[300px]">
            <div className="rounded-2xl overflow-hidden bg-white-1/5 h-full border border-white-1/10 shadow-md">
                <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-white-1/5 to-transparent animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/50" />
                    <div className="relative h-full flex flex-col justify-end p-6 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white-1/10 animate-pulse" />
                            <div className="h-5 bg-white-1/10 rounded animate-pulse w-24" />
                        </div>
                        <div className="h-10 bg-white-1/10 rounded animate-pulse w-3/4" />
                        <div className="h-12 bg-white-1/10 rounded animate-pulse w-full" />
                        <div className="flex items-center gap-6">
                            <div className="h-10 bg-orange-1/20 rounded-full animate-pulse w-36" />
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-white-1/10 animate-pulse" />
                                <div className="h-5 bg-white-1/10 rounded animate-pulse w-10" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-white-1/10 animate-pulse" />
                                <div className="h-5 bg-white-1/10 rounded animate-pulse w-10" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-white-1/10 animate-pulse" />
                                <div className="h-5 bg-white-1/10 rounded animate-pulse w-10" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center w-full mt-4">
                {[...Array(2)].map((_, index) => (
                    <div key={index} className="w-3 h-3 rounded-full mx-1 bg-white-1/10 animate-pulse" />
                ))}
            </div>
        </section>
    )
}

export default FeaturedSkeleton