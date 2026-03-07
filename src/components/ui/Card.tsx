import React from 'react';

interface CardProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'surface';
    className?: string;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'surface',
    className = ''
}) => {
    const variants = {
        primary: "bg-card-primary-bg border-card-primary-border",
        secondary: "bg-card-secondary-bg border-card-secondary-border",
        surface: "bg-card-surface-bg border-card-surface-border"
    };

    return (
        <section className={`rounded-panel shadow-panel p-6 md:p-8 border ${variants[variant]} ${className}`}>
            {children}
        </section>
    );
};
