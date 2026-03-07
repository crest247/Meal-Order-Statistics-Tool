import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'error' | 'outline';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'primary',
    className = ''
}) => {
    const variants = {
        primary: "text-white bg-badge-primary-bg shadow-sm",
        secondary: "text-white bg-badge-secondary-bg shadow-sm",
        error: "bg-badge-error-bg text-white shadow-sm",
        outline: "text-badge-outline-text bg-badge-outline-bg border border-badge-outline-border"
    };

    return (
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};
