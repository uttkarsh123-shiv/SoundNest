import React from 'react';
import { Filter, Clock, TrendingUp, Heart, Star, LayoutGrid, List, Languages } from 'lucide-react';

interface FilterControlsProps {
    search: string;
    filterOption: 'latest' | 'trending' | 'popular' | 'topRated';
    setFilterOption: (option: 'latest' | 'trending' | 'popular' | 'topRated') => void;
    showCategoryFilter: boolean;
    setShowCategoryFilter: (show: boolean) => void;
    showLanguageFilter: boolean;
    setShowLanguageFilter: (show: boolean) => void;
    selectedCategories: string[];
    selectedLanguages: string[];
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

const FilterControls = ({
    search,
    filterOption,
    setFilterOption,
    showCategoryFilter,
    setShowCategoryFilter,
    showLanguageFilter,
    setShowLanguageFilter,
    selectedCategories,
    selectedLanguages,
    viewMode,
    setViewMode
}: FilterControlsProps) => {
    return (
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
                        <Languages size={20} />
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
    );
};

export default FilterControls;