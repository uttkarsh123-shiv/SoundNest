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
        <div className="flex justify-center mt-6 sm:mt-8 gap-3">
            {hasMore && loadMoreHandler && (
                <button
                    onClick={loadMoreHandler}
                    className="bg-green-1 text-white py-2 sm:py-2.5 px-5 sm:px-6 rounded-md transition-all duration-300 flex items-center gap-2 font-semibold shadow-md hover:shadow-lg hover:shadow-green-1/20 hover:bg-green-2 active:scale-[0.98] group text-sm sm:text-base border border-green-1/20"
                >
                    Show More
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-y-0.5">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </button>
            )}

            {canShowLess && showLessHandler && (
                <button
                    onClick={showLessHandler}
                    className="bg-white-1/10 text-white py-2 sm:py-2.5 px-5 sm:px-6 rounded-md transition-all duration-300 flex items-center gap-2 font-semibold shadow-md hover:shadow-lg hover:bg-white-1/15 active:scale-[0.98] border border-white-1/20 group text-sm sm:text-base"
                >
                    Show Less
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-0.5">
                        <path d="M18 15l-6-6-6 6" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default ShowMoreLessButtons;