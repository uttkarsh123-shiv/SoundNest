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
          className="bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-full transition-all duration-300 flex items-center gap-2"
        >
          Show More
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      )}
      
      {canShowLess && showLessHandler && (
        <button 
          onClick={showLessHandler}
          className="bg-white-1/10 hover:bg-white-1/20 text-white py-2 px-6 rounded-full transition-all duration-300 flex items-center gap-2"
        >
          Show Less
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default ShowMoreLessButtons;