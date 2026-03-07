import React from 'react';

interface ScrollAreaProps {
    children: React.ReactNode;
    maxHeight?: string | number;
    className?: string;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
    children,
    maxHeight = '600px',
    className = '',
}) => {
    const style = typeof maxHeight === 'number' ? { maxHeight: `${maxHeight}px` } : { maxHeight };

    return (
        <div
            className={`overflow-y-auto pr-2 custom-scrollbar ${className}`}
            style={style}
        >
            {children}
        </div>
    );
};
