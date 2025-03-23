import React from 'react';

interface ShowMoreLessButtonsProps {
    loadMoreHandler?: () => void;
    showLessHandler?: () => void;
    hasMore?: boolean;
    canShowLess?: boolean;
}

const ShowMoreLessButtons = ({
    loadMoreHandler,
    showLessHandler,
    hasMore,
    canShowLess
}: ShowMoreLessButtonsProps) => {
    return (
        <div className="flex justify-center mt-8 gap-4">
            {hasMore && loadMoreHandler && (
                <button
                    onClick={loadMoreHandler}
                    className="bg-[#f97535] text-white py-2.5 px-7 rounded-full transition-all duration-300 flex items-center gap-2 font-medium shadow-md hover:shadow-lg hover:bg-[#f97535]/90 hover:scale-105 active:scale-95 group"
                >
                    Show More
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-y-1">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </button>
            )}

            {canShowLess && showLessHandler && (
                <button
                    onClick={showLessHandler}
                    className="bg-white-1/10 text-white py-2.5 px-7 rounded-full transition-all duration-300 flex items-center gap-2 font-medium shadow-md hover:shadow-lg hover:bg-white-1/20 hover:scale-105 active:scale-95 border border-white-1/20 group"
                >
                    Show Less
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-1">
                        <path d="M18 15l-6-6-6 6" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default ShowMoreLessButtons;