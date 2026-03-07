import React from 'react';

interface PageLayoutProps {
    children: React.ReactNode;
    title: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {
    return (
        <div className="min-h-screen bg-app-base text-on-surface p-4 md:p-8 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-normal tracking-tight text-on-surface">
                        {title}
                    </h1>
                </header>
                {children}
            </div>
        </div>
    );
};

interface GridLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export const GridLayout: React.FC<GridLayoutProps> = ({ children, className = '' }) => {
    return (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start ${className}`}>
            {children}
        </div>
    );
};
