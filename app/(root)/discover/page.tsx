"use client"

import Searchbar from '@/components/Searchbar'
import { api } from '@/convex/_generated/api'
import { podcastTypes, languageOptions } from '@/constants/PodcastFields'
import { useQuery } from 'convex/react'
import { Filter, Clock, TrendingUp, Heart, RefreshCw, X, Globe, LayoutGrid, List, Star, Headphones } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Discover = ({ searchParams: { search } }: { searchParams: { search: string } }) => {
    const [filterOption, setFilterOption] = useState<'latest' | 'trending' | 'popular' | 'topRated'>('trending')
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showCategoryFilter, setShowCategoryFilter] = useState(false)
    const [showLanguageFilter, setShowLanguageFilter] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const router = useRouter()

    // Use the search query to get initial podcasts
    const podcastsData = useQuery(api.podcasts.getPodcastBySearch, { search: search || '' })
    
    // Use the getFilteredPodcasts query for sorting
    const filteredPodcastsData = useQuery(api.podcasts.getFilteredPodcasts, { type: filterOption })

    useEffect(() => {
        if (podcastsData && filteredPodcastsData) {
            setIsLoading(false)
        }
    }, [podcastsData, filteredPodcastsData])

    // Combine search results with filtering and sorting
    const filteredPodcasts = React.useMemo(() => {
        if (!podcastsData || !filteredPodcastsData) return []
        
        let resultPodcasts = [];
        
        // If there's a search query, get search results but apply the same sorting logic
        if (search) {
            // Get the search results
            const searchResults = [...podcastsData];
            
            // Apply the same sorting logic from filteredPodcastsData
            // Find matching podcasts in filteredPodcastsData to preserve their order
            const orderedResults = filteredPodcastsData
                .filter(filteredPodcast => 
                    searchResults.some(searchPodcast => 
                        searchPodcast._id === filteredPodcast._id
                    )
                );
                
            // Add any remaining search results that weren't in the filtered results
            const remainingResults = searchResults.filter(searchPodcast => 
                !orderedResults.some(orderedPodcast => 
                    orderedPodcast._id === searchPodcast._id
                )
            );
            
            resultPodcasts = [...orderedResults, ...remainingResults];
        } else {
            // If no search query, use the filtered podcasts from the API
            resultPodcasts = filteredPodcastsData;
        }
        
        // Apply category and language filters
        return resultPodcasts
            .filter(podcast => selectedCategories.length === 0 ||
                (podcast.podcastType && selectedCategories.includes(podcast.podcastType)))
            .filter(podcast => selectedLanguages.length === 0 ||
                (podcast.language && selectedLanguages.includes(podcast.language)));
                
    }, [podcastsData, filteredPodcastsData, selectedCategories, selectedLanguages, search, filterOption])

    const toggleCategory = (category: string) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category))
        } else {
            setSelectedCategories([...selectedCategories, category])
        }
    }

    const toggleLanguage = (language: string) => {
        if (selectedLanguages.includes(language)) {
            setSelectedLanguages(selectedLanguages.filter(l => l !== language))
        } else {
            setSelectedLanguages([...selectedLanguages, language])
        }
    }

    const clearCategories = () => {
        setSelectedCategories([])
    }

    const clearLanguages = () => {
        setSelectedLanguages([])
    }

    const clearAllFilters = () => {
        clearCategories()
        clearLanguages()
    }

    return (
        <div className="flex flex-col gap-9 pb-12 pt-6">
            {/* Enhanced header section with glass morphism effect */}
            <div className="bg-gradient-to-r from-white-1/10 to-white-1/5 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white-1/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-1/10 to-transparent opacity-50"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white-1 mb-5 flex items-center gap-2">
                        Discover Podcasts
                    </h1>
                    <Searchbar />
                </div>
            </div>

            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-5">
                    {/* Improved header and filter controls with better visual hierarchy */}
                    <div className="bg-gradient-to-br from-white-1/10 to-white-1/5 backdrop-blur-sm p-5 rounded-xl border border-white-1/10 shadow-lg">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <h2 className="text-2xl font-bold text-white-1 flex items-center">
                                {!search ? 'Browse Community Podcasts' : 'Search results for '}
                                {search && <span className="text-orange-1 ml-1 bg-orange-1/10 px-3 py-1 rounded-lg">{search}</span>}
                            </h2>
                            <div className="flex flex-wrap items-center gap-3">
                                {/* View toggle with improved styling */}
                                <div className="bg-black/20 p-1 rounded-lg flex shadow-inner backdrop-blur-sm">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'grid'
                                            ? 'bg-orange-1 text-black shadow-md scale-105'
                                            : 'text-white-2 hover:bg-white-1/10'}`}
                                        aria-label="Grid view"
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'list'
                                            ? 'bg-orange-1 text-black shadow-md scale-105'
                                            : 'text-white-2 hover:bg-white-1/10'}`}
                                        aria-label="List view"
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Filter controls in a separate row with better spacing */}
                        <div className="mt-5 flex flex-wrap gap-3 items-center">
                            <div className="flex-1 flex flex-wrap gap-3">
                                {/* Enhanced filter buttons */}
                                <button
                                    onClick={() => {
                                        setShowCategoryFilter(!showCategoryFilter)
                                        if (showLanguageFilter) setShowLanguageFilter(false)
                                    }}
                                    className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${showCategoryFilter || selectedCategories.length > 0
                                        ? 'bg-orange-1 text-black shadow-md'
                                        : 'bg-black/20 text-white-2 hover:bg-white-1/10'
                                        }`}
                                >
                                    <Filter size={16} />
                                    Categories {selectedCategories.length > 0 && (
                                        <span className="bg-black/30 text-white px-2 py-0.5 rounded-full text-xs ml-1">
                                            {selectedCategories.length}
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        setShowLanguageFilter(!showLanguageFilter)
                                        if (showCategoryFilter) setShowCategoryFilter(false)
                                    }}
                                    className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${showLanguageFilter || selectedLanguages.length > 0
                                        ? 'bg-orange-1 text-black shadow-md'
                                        : 'bg-black/20 text-white-2 hover:bg-white-1/10'
                                        }`}
                                >
                                    <Globe size={16} />
                                    Languages {selectedLanguages.length > 0 && (
                                        <span className="bg-black/30 text-white px-2 py-0.5 rounded-full text-xs ml-1">
                                            {selectedLanguages.length}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Enhanced sort options */}
                            <div className="bg-black/20 p-1.5 rounded-lg shadow-inner backdrop-blur-sm">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setFilterOption('trending')}
                                        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${filterOption === 'trending'
                                            ? 'bg-orange-1 text-black shadow-md'
                                            : 'text-white-2 hover:bg-white-1/10'
                                            }`}
                                    >
                                        <TrendingUp size={15} />
                                        Trending
                                    </button>
                                    <button
                                        onClick={() => setFilterOption('latest')}
                                        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${filterOption === 'latest'
                                            ? 'bg-orange-1 text-black shadow-md'
                                            : 'text-white-2 hover:bg-white-1/10'
                                            }`}
                                    >
                                        <Clock size={15} />
                                        Latest
                                    </button>
                                    <button
                                        onClick={() => setFilterOption('popular')}
                                        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${filterOption === 'popular'
                                            ? 'bg-orange-1 text-black shadow-md'
                                            : 'text-white-2 hover:bg-white-1/10'
                                            }`}
                                    >
                                        <Heart size={15} />
                                        Popular
                                    </button>
                                    <button
                                        onClick={() => setFilterOption('topRated')}
                                        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${filterOption === 'topRated'
                                            ? 'bg-orange-1 text-black shadow-md'
                                            : 'text-white-2 hover:bg-white-1/10'
                                            }`}
                                    >
                                        <Star size={15} />
                                        Top Rated
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced category filter with glass morphism */}
                    {showCategoryFilter && (
                        <div className="bg-gradient-to-br from-white-1/10 to-white-1/5 backdrop-blur-sm p-6 rounded-xl border border-white-1/10 shadow-lg animate-fadeIn">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-white-1 font-semibold flex items-center gap-2 text-lg">
                                    <Filter size={18} className="text-orange-1" />
                                    Filter by Category
                                </h3>
                                <div className="flex gap-3">
                                    {selectedCategories.length > 0 && (
                                        <button
                                            onClick={clearCategories}
                                            className="text-sm text-white-2 hover:text-orange-1 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-black/20"
                                        >
                                            Clear all <X size={14} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowCategoryFilter(false)}
                                        className="text-sm bg-black/20 hover:bg-white-1/10 px-3 py-1.5 rounded-lg text-white-2 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                            <div className="flex pl-1 flex-wrap gap-3 max-h-[200px] overflow-y-auto pr-2 pb-2 custom-scrollbar">
                                {podcastTypes.map((category) => (
                                    <button
                                        key={category.value}
                                        onClick={() => toggleCategory(category.value)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategories.includes(category.value)
                                            ? 'bg-orange-1 text-black shadow-md scale-105'
                                            : 'bg-black/20 text-white-2 hover:bg-white-1/10 hover:scale-105'
                                            }`}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Enhanced language filter with alphabetical dropdown */}
                    {showLanguageFilter && (
                        <div className="bg-gradient-to-br from-white-1/10 to-white-1/5 backdrop-blur-sm p-6 rounded-xl border border-white-1/10 shadow-lg animate-fadeIn">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-white-1 font-semibold flex items-center gap-2 text-lg">
                                    <Globe size={18} className="text-orange-1" />
                                    Filter by Language
                                </h3>
                                <div className="flex gap-3">
                                    {selectedLanguages.length > 0 && (
                                        <button
                                            onClick={clearLanguages}
                                            className="text-sm text-white-2 hover:text-orange-1 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-black/20"
                                        >
                                            Clear all <X size={14} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowLanguageFilter(false)}
                                        className="text-sm bg-black/20 hover:bg-white-1/10 px-3 py-1.5 rounded-lg text-white-2 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>

                            {/* Alphabetical language groups with reduced height */}
                            <div className="max-h-[140px] overflow-y-auto pr-2 pb-2 custom-scrollbar">
                                {/* Group languages alphabetically */}
                                {(() => {
                                    // Sort languages alphabetically by label
                                    const sortedLanguages = [...languageOptions].sort((a, b) =>
                                        a.label.localeCompare(b.label)
                                    );

                                    // Group by first letter
                                    const groups = sortedLanguages.reduce((acc, lang) => {
                                        const firstLetter = lang.label[0].toUpperCase();
                                        if (!acc[firstLetter]) acc[firstLetter] = [];
                                        acc[firstLetter].push(lang);
                                        return acc;
                                    }, {} as Record<string, typeof languageOptions>);

                                    // Get sorted letters
                                    const letters = Object.keys(groups).sort();

                                    return letters.map(letter => (
                                        <div key={letter} className="mb-3">
                                            <div className="text-orange-1 font-bold text-sm mb-1.5 border-b border-white-1/10 pb-0.5">
                                                {letter}
                                            </div>
                                            <div className="flex flex-wrap gap-2 pl-1.5">
                                                {groups[letter].map((language) => (
                                                    <button
                                                        key={language.value}
                                                        onClick={() => toggleLanguage(language.value)}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${selectedLanguages.includes(language.value)
                                                            ? 'bg-orange-1 text-black shadow-md scale-105'
                                                            : 'bg-black/20 text-white-2 hover:bg-white-1/10 hover:scale-105'
                                                            }`}
                                                    >
                                                        {language.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    )}

                    {/* Enhanced selected languages display */}
                    {selectedLanguages.length > 0 && !showLanguageFilter && (
                        <div className="flex flex-wrap gap-2.5 items-center bg-white-1/5 p-4 rounded-xl border border-white-1/10">
                            <span className="text-white-1 text-sm font-medium bg-white-1/10 px-3 py-1 rounded-lg">Language:</span>
                            {selectedLanguages.map(lang => {
                                const languageLabel = languageOptions.find(l => l.value === lang)?.label || lang;
                                return (
                                    <div key={lang} className="bg-orange-1/20 text-orange-1 px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 shadow-sm">
                                        {languageLabel}
                                        <button
                                            onClick={() => toggleLanguage(lang)}
                                            className="hover:bg-orange-1/30 rounded-full p-0.5 transition-colors"
                                            aria-label={`Remove ${languageLabel} filter`}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                            <button
                                onClick={clearLanguages}
                                className="text-sm text-orange-1 hover:text-orange-2 font-medium transition-colors ml-2 bg-orange-1/5 px-3 py-1 rounded-lg hover:bg-orange-1/10"
                            >
                                Clear all
                            </button>
                        </div>
                    )}

                    {/* Enhanced combined filters display */}
                    {(selectedCategories.length > 0 || selectedLanguages.length > 0) && (
                        <div className="flex justify-end">
                            <button
                                onClick={clearAllFilters}
                                className="text-sm text-white-2 hover:text-orange-1 px-4 py-2 rounded-lg bg-white-1/5 hover:bg-white-1/10 transition-all flex items-center gap-2"
                            >
                                <X size={14} />
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Enhanced loading state with improved skeleton UI */}
                {isLoading ? (
                    <div className={viewMode === 'grid' ? "podcast_grid" : "flex flex-col gap-4"}>
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className={`bg-white-1/5 rounded-xl overflow-hidden border border-white-1/10 shadow-md ${viewMode === 'list' ? "flex" : ""
                                }`}>
                                <div className={`${viewMode === 'grid' ? "w-full aspect-square" : "w-[120px] h-[120px]"} bg-white-1/10 animate-pulse relative`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white-1/5 to-transparent"></div>
                                </div>
                                <div className="p-5 space-y-3 flex-1">
                                    <div className="h-5 bg-white-1/10 rounded-md animate-pulse" style={{ width: `${70 + Math.random() * 25}%` }} />
                                    <div className="h-4 bg-white-1/10 rounded-md animate-pulse w-full" />
                                    <div className="h-4 bg-white-1/10 rounded-md animate-pulse" style={{ width: `${40 + Math.random() * 30}%` }} />
                                    <div className="flex justify-between pt-2">
                                        <div className="h-4 bg-white-1/10 rounded-md animate-pulse w-[40px]" />
                                        <div className="h-4 bg-white-1/10 rounded-md animate-pulse w-[40px]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {filteredPodcasts.length > 0 ? (
                            <>
                                <div className={viewMode === 'grid' ? "podcast_grid" : "flex flex-col gap-4"}>
                                    {filteredPodcasts.map((podcast) => (
                                        <div
                                            key={podcast._id}
                                            onClick={() => router.push(`/podcasts/${podcast._id}`)}
                                            className={`bg-white-1/5 rounded-xl overflow-hidden cursor-pointer hover:bg-white-1/10 transition-all ${viewMode === 'list' ? "flex" : ""
                                                }`}
                                        >
                                            <div className={`relative ${viewMode === 'grid' ? "w-full aspect-square" : "min-w-[120px] h-[120px]"}`}>
                                                <Image
                                                    src={podcast.imageUrl!}
                                                    alt={podcast.podcastTitle}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-4 flex-1">
                                                <h3 className="text-white-1 font-bold truncate">{podcast.podcastTitle}</h3>
                                                <p className={`text-white-2 text-sm mt-1 ${viewMode === 'grid' ? "line-clamp-2 min-h-[40px]" : "line-clamp-1"}`}>
                                                    {podcast.podcastDescription}
                                                </p>

                                                {podcast.podcastType && (
                                                    <span className="inline-block bg-orange-1/20 text-orange-1 text-xs px-2 py-1 rounded-full mt-2">
                                                        {podcastTypes.find(c => c.value === podcast.podcastType)?.label || podcast.podcastType}
                                                    </span>
                                                )}

                                                <div className="flex justify-between mt-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1">
                                                            <Heart size={14} className="text-white-3" />
                                                            <span className="text-xs text-white-2">{podcast.likeCount || 0}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Headphones size={14} className="text-white-3" />
                                                            <span className="text-xs text-white-2">{podcast.views || 0}</span>
                                                        </div>
                                                        {podcast.averageRating && (
                                                            <div className="flex items-center gap-1">
                                                                <Star size={14} className="text-white-3" />
                                                                <span className="text-xs text-white-2">
                                                                    {podcast.averageRating.toFixed(1)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {podcast.audioDuration !== undefined && (
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={14} className="text-white-3" />
                                                            <span className="text-xs text-white-2">
                                                                {Math.floor(podcast.audioDuration / 60) > 0
                                                                    ? `${Math.floor(podcast.audioDuration / 60)} min`
                                                                    : `${Math.round(podcast.audioDuration)} sec`}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center text-white-2 text-sm mt-6 bg-white-1/5 py-3 px-4 rounded-lg inline-block mx-auto">
                                    Showing {filteredPodcasts.length} {filteredPodcasts.length === 1 ? 'podcast' : 'podcasts'}
                                    {(selectedCategories.length > 0 || selectedLanguages.length > 0) && ' with selected filters'}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white-1/5 rounded-xl border border-white-1/10">
                                <div className="bg-white-1/10 p-6 rounded-full mb-5 shadow-inner">
                                    <RefreshCw size={32} className="text-orange-1" />
                                </div>
                                <h3 className="text-2xl font-bold text-white-1 mb-3">No podcasts found</h3>
                                <p className="text-white-2 text-center max-w-md mb-8 px-4">
                                    {selectedCategories.length > 0 || selectedLanguages.length > 0
                                        ? "No podcasts match your selected filters. Try different options or clear filters."
                                        : search
                                            ? `We couldn't find any podcasts matching "${search}". Try a different search term.`
                                            : "We couldn't find any podcasts. Try a different filter or check back later."}
                                </p>
                                <button
                                    onClick={() => {
                                        clearAllFilters();
                                        if (search) window.location.href = '/discover';
                                    }}
                                    className="bg-orange-1 text-black px-8 py-3 rounded-full font-semibold hover:bg-orange-2 transition-colors shadow-lg"
                                >
                                    {selectedCategories.length > 0 || selectedLanguages.length > 0 ? "Clear Filters" : "Clear Search"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Discover