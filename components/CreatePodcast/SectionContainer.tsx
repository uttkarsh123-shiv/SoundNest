import React, { ReactNode } from 'react';
import SectionHeader from './SectionHeader';

interface SectionContainerProps {
    title: string;
    children: ReactNode;
    rightElement?: ReactNode;
}

const SectionContainer = ({ title, children, rightElement }: SectionContainerProps) => {
    return (
        <div className="space-y-3">
            <SectionHeader title={title} rightElement={rightElement} />
            <div className="bg-black-5/40 rounded-lg p-5 border border-white-1/5">
                {children}
            </div>
        </div>
    );
};

export default SectionContainer;