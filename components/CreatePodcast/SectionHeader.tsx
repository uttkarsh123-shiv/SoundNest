import React from 'react';

interface SectionHeaderProps {
    title: string;
    rightElement?: React.ReactNode;
}

const SectionHeader = ({ title, rightElement }: SectionHeaderProps) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="h-3.5 w-0.5 bg-green-1 rounded-full" />
                <h2 className="text-[13px] font-bold text-white-3 uppercase tracking-widest">{title}</h2>
            </div>
            {rightElement}
        </div>
    );
};

export default SectionHeader;