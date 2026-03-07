import React from 'react';

interface StackProps {
    children: React.ReactNode;
    direction?: 'row' | 'col';
    gap?: number | string;
    align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}

export const Stack: React.FC<StackProps> = ({
    children,
    direction = 'col',
    gap = 4,
    align = 'stretch',
    justify = 'start',
    className = '',
    onClick,
}) => {
    const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';

    // Using a mapping for Tailwind gaps to ensure they are detected by the JIT compiler
    const gapStyles = {
        0: 'gap-0',
        1: 'gap-1',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        6: 'gap-6',
        8: 'gap-8',
        12: 'gap-12',
    }[gap as number] || gap;

    const alignStyles = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        baseline: 'items-baseline',
        stretch: 'items-stretch',
    };

    const justifyStyles = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
    };

    return (
        <div
            className={`flex ${directionClass} ${gapStyles} ${alignStyles[align]} ${justifyStyles[justify]} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
