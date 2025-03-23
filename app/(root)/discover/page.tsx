"use client"

import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React, { useState, useEffect } from 'react'
import DiscoverHeader from '@/components/Discover/DiscoverHeader'
import FilterControls from '@/components/Discover/FilterControls'
import CategoryFilter from '@/components/Discover/CategoryFilter'
import LanguageFilter from '@/components/Discover/LanguageFilter'
import SelectedFilters from '@/components/Discover/SelectedFilters'
import PodcastDisplay from '@/components/Discover/PodcastDisplay'
import PodcastSkeleton from '@/components/Discover/PodcastSkeleton'
import EmptyState from '@/components/Discover/EmptyState'

// Define a type for the filter options
type FilterOptionType = 'latest' | 'trending' | 'popular' | 'topRated';

const Discover = ({ searchParams }: { searchParams: { search: string, filter?: string } }) => {
    // Use a helper function to determine the initial filter option
    const getInitialFilterOption = (filter: string | undefined): FilterOptionType => {
        if (filter === 'latest' || filter === 'trending' || 
            filter === 'popular' || filter === 'topRated') {
            return filter;
        }
        return 'trending'; // Default value
    };

    const [filterOption, setFilterOption] = useState<FilterOptionType>(
        getInitialFilterOption(searchParams.filter)
    );
    
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCategoryFilter, setShowCategoryFilter] = useState(false);
    const [showLanguageFilter, setShowLanguageFilter] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const search = searchParams.search || '';
    
    // Use the new combined query function
    const filteredPodcasts = useQuery(api.podcasts.getFilteredPodcasts, {
        search,
        type: filterOption,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        languages: selectedLanguages.length > 0 ? selectedLanguages : undefined
    });

    useEffect(() => {
        if (filteredPodcasts) {
            setIsLoading(false);
        }
    }, [filteredPodcasts]);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category) 
                : [...prev, category]
        );
        setIsLoading(true); // Show loading state when filters change
    }

    const toggleLanguage = (language: string) => {
        setSelectedLanguages(prev => 
            prev.includes(language) 
                ? prev.filter(l => l !== language) 
                : [...prev, language]
        );
        setIsLoading(true); // Show loading state when filters change
    }

    const clearCategories = () => {
        setSelectedCategories([]);
        setIsLoading(true); // Show loading state when filters change
    }

    const clearLanguages = () => {
        setSelectedLanguages([]);
        setIsLoading(true); // Show loading state when filters change
    }

    const clearAllFilters = () => {
        clearCategories();
        clearLanguages();
    }

    return (
        <div className="flex flex-col gap-9 pb-12 pt-6">
            {/* Header section */}
            <DiscoverHeader />

            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-5">
                    {/* Filter controls */}
                    <FilterControls 
                        search={search}
                        filterOption={filterOption}
                        setFilterOption={(option) => {
                            setFilterOption(option);
                            setIsLoading(true); // Show loading state when filter changes
                        }}
                        showCategoryFilter={showCategoryFilter}
                        setShowCategoryFilter={setShowCategoryFilter}
                        showLanguageFilter={showLanguageFilter}
                        setShowLanguageFilter={setShowLanguageFilter}
                        selectedCategories={selectedCategories}
                        selectedLanguages={selectedLanguages}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                    />

                    {/* Category filter */}
                    <CategoryFilter 
                        showCategoryFilter={showCategoryFilter}
                        setShowCategoryFilter={setShowCategoryFilter}
                        selectedCategories={selectedCategories}
                        toggleCategory={toggleCategory}
                        clearCategories={clearCategories}
                    />

                    {/* Language filter */}
                    <LanguageFilter 
                        showLanguageFilter={showLanguageFilter}
                        setShowLanguageFilter={setShowLanguageFilter}
                        selectedLanguages={selectedLanguages}
                        toggleLanguage={toggleLanguage}
                        clearLanguages={clearLanguages}
                    />

                    {/* Selected filters display */}
                    <SelectedFilters 
                        selectedLanguages={selectedLanguages}
                        toggleLanguage={toggleLanguage}
                        clearLanguages={clearLanguages}
                        showLanguageFilter={showLanguageFilter}
                        selectedCategories={selectedCategories}
                        toggleCategory={toggleCategory}
                        clearCategories={clearCategories}
                        showCategoryFilter={showCategoryFilter}
                        clearAllFilters={clearAllFilters}
                    />
                </div>

                {/* Podcast display or loading state */}
                {isLoading ? (
                    <PodcastSkeleton viewMode={viewMode} />
                ) : (
                    <>
                        {filteredPodcasts && filteredPodcasts.length > 0 ? (
                            <>
                                <PodcastDisplay 
                                    filteredPodcasts={filteredPodcasts}
                                    viewMode={viewMode}
                                />
                                <div className="text-center text-white-2 text-sm mt-6 bg-white-1/5 py-3 px-4 rounded-lg inline-block mx-auto">
                                    Showing {filteredPodcasts.length} {filteredPodcasts.length === 1 ? 'podcast' : 'podcasts'}
                                    {(selectedCategories.length > 0 || selectedLanguages.length > 0) && ' with selected filters'}
                                </div>
                            </>
                        ) : (
                            <EmptyState 
                                search={search}
                                selectedCategories={selectedCategories}
                                selectedLanguages={selectedLanguages}
                                clearAllFilters={clearAllFilters}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Discover