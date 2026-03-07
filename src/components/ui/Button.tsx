import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    color?: 'default' | 'error';
    isLoading?: boolean;
    isIcon?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    color = 'default',
    isLoading,
    isIcon,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = `relative z-10 rounded-full font-medium flex items-center justify-center gap-2 transition-all active:not(:disabled):scale-95 active:not(:disabled):opacity-80 disabled:opacity-50 disabled:pointer-events-none ${isIcon ? 'p-2 aspect-square flex-shrink-0' : 'w-full px-6 py-2.5'
        }`;

    const variants = {
        primary: "bg-btn-primary-bg text-btn-primary-text hover:brightness-110 disabled:bg-gray-300 disabled:text-gray-500",
        secondary: "bg-btn-secondary-bg text-btn-secondary-text hover:brightness-110",
        ghost: "hover:bg-btn-ghost-hover-bg text-on-surface-variant transition-colors"
    };

    // Allow overriding the hover/text colors for ghost buttons (e.g., destructive actions)
    let colorStyles = '';
    if (variant === 'ghost' && color === 'error') {
        colorStyles = 'hover:!bg-btn-error-hover-bg hover:!text-error';
    }

    const finalClassName = `${baseStyles} ${variants[variant]} ${colorStyles} ${className}`;

    return (
        <button className={finalClassName} disabled={disabled || isLoading} {...props}>
            {children}
        </button>
    );
};
