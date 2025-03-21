import React from 'react';
import { X } from 'lucide-react';
import { languageOptions } from '@/constants/PodcastFields';

interface SelectedFiltersProps {
  selectedLanguages: string[];
  toggleLanguage: (language: string) => void;
  clearLanguages: () => void;
  showLanguageFilter: boolean;
  selectedCategories: string[];
  clearAllFilters: () => void;
}

const SelectedFilters = ({ 
  selectedLanguages, 
  toggleLanguage, 
  clearLanguages, 
  showLanguageFilter,
  selectedCategories,
  clearAllFilters
}: SelectedFiltersProps) => {
  return (
    <>
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
    </>
  );
};

export default SelectedFilters;