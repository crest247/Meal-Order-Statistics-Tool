import React from 'react';

interface DividerProps {
    className?: string;
    mobileOnly?: boolean;
    variant?: 'thin' | 'thick';
}

export const Divider: React.FC<DividerProps> = ({
    className = '',
    mobileOnly = false,
    variant = 'thin'
}) => {
    const styles = {
        thin: 'h-[1px] my-4',
        thick: 'h-[2px] my-2'
    };

    return (
        <div
            className={`${styles[variant]} bg-outline-variant w-full ${mobileOnly ? 'hidden max-lg:block' : ''} ${className}`}
            aria-hidden="true"
        />
    );
};
