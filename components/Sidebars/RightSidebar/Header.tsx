import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

const Header = ({ headerTitle, titleClassName }: { headerTitle?: string; titleClassName?: string }) => {
  let linkUrl = "/";
  
  if (headerTitle === "Fans Like You") {
    linkUrl = "/discover";
  } else if (headerTitle === "Top Podcasters" || headerTitle === "Popular Creators") {
    linkUrl = "/community";
  }

  return (
    <header className="flex items-center justify-between">
      {headerTitle ? (
        <h1 className={cn('text-[13px] font-bold text-white-1 uppercase tracking-widest', titleClassName)}>{headerTitle}</h1>
      ) : <div />}
      {/* Empty div is passed as we want to occupy space if header title doesn't exist */}
      <Link 
        href={linkUrl} 
        className="text-[12px] font-semibold text-green-1 hover:text-green-2 transition-all duration-300"
      >
        See all
      </Link>
    </header>
  )
}

export default Header