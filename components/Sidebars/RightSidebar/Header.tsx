import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

const Header = ({ headerTitle, titleClassName }: { headerTitle?: string; titleClassName?: string }) => {
  const pathname = usePathname();
  const isDiscoverPage = pathname === '/discover';

  // Determine the link URL based on the header title and current page
  let linkUrl = "/discover?filter=trending";
  
  if (headerTitle === "Fans Like You") {
    linkUrl = "/discover?filter=popular";
  }
  
  // If we're already on the discover page, use # to prevent navigation
  if (isDiscoverPage) {
    linkUrl = "#";
  }

  return (
    <header className="flex items-center justify-between">
      {headerTitle ? (
        <h1 className={cn('text-18 font-bold text-white-1', titleClassName)}>{headerTitle}</h1>
      ) : <div />}
      {/* Empty div is passed as we want to occupy space if header title doesn't exist */}
      <Link 
        href={linkUrl} 
        className="text-16 font-semibold text-orange-1 hover:text-orange-400 hover:scale-105 transition-all duration-300"
        onClick={(e) => {
          if (isDiscoverPage) {
            e.preventDefault();
          }
        }}
      >
        See all
      </Link>
    </header>
  )
}

export default Header