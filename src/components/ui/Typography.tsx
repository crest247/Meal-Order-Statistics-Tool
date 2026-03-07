import React from 'react';

type Variant = 'h1' | 'h2' | 'h3' | 'body1' | 'body2' | 'caption';

interface TypographyProps {
    children: React.ReactNode;
    variant?: Variant;
    className?: string;
    color?: 'primary' | 'secondary' | 'surface' | 'variant' | 'error' | 'outline' | 'inherit';
}

export const Typography: React.FC<TypographyProps> = ({
    children,
    variant = 'body1',
    className = '',
    color = 'inherit',
}) => {
    const variantStyles = {
        h1: 'text-3xl md:text-4xl font-normal tracking-tight',
        h2: 'text-xl font-medium',
        h3: 'text-base font-medium',
        body1: 'text-base',
        body2: 'text-sm',
        caption: 'text-xs font-medium',
    };

    const colorStyles = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        surface: 'text-on-surface',
        variant: 'text-on-surface-variant',
        error: 'text-error',
        outline: 'text-outline',
        inherit: '',
    };

    const Component = (variant.startsWith('h') ? variant : 'span') as React.ElementType;

    return (
        <Component className={`${variantStyles[variant]} ${colorStyles[color]} ${className}`}>
            {children}
        </Component>
    );
};
