import React from 'react';

interface ScrimProps {
    children?: React.ReactNode;
    blur?: boolean;
    darken?: boolean;
    absolute?: boolean;
    className?: string;
    onClick?: () => void;
}

export const Scrim: React.FC<ScrimProps> = ({
    children,
    blur = true,
    darken = true,
    absolute = false,
    className = '',
    onClick,
}) => {
    const positionClass = absolute ? 'absolute inset-0' : 'fixed inset-0';
    const blurClass = blur ? 'scrim-blur' : '';
    const darkenClass = darken ? 'bg-black/50' : 'bg-transparent';
    const zIndexClass = absolute ? 'z-20' : 'z-50';

    return (
        <div
            className={`${positionClass} ${darkenClass} ${blurClass} ${zIndexClass} flex items-center justify-center p-4 ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
