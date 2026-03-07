import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Stack } from './Stack';
import { Typography } from './Typography';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    labelBg?: string;
    error?: boolean;
    helperText?: string;
    containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    labelBg = 'bg-surface',
    error,
    helperText,
    id,
    className = '',
    containerClassName = '',
    children,
    ...props
}) => {
    return (
        <Stack gap={1} className={containerClassName}>
            <Stack className="relative">
                <select
                    id={id}
                    className={`block w-full px-4 py-3.5 text-base text-input-text bg-transparent border ${error ? 'border-input-border-error focus:ring-input-border-error' : 'border-input-border focus:ring-input-border-focus'} rounded-[4px] appearance-none focus:outline-none focus:ring-2 focus:border-transparent peer disabled:opacity-50 font-mono ${className}`}
                    {...props}
                >
                    {children}
                </select>
                <label
                    htmlFor={id}
                    className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] ${labelBg} px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 pointer-events-none
            ${error ? 'text-input-border-error peer-focus:text-input-border-error' : 'text-input-label peer-focus:text-input-label-focus'}`}
                >
                    {label}
                </label>
                <Stack align="center" justify="center" className="absolute inset-y-0 right-0 px-4 pointer-events-none text-on-surface-variant">
                    <ChevronDown size={20} />
                </Stack>
            </Stack>
            {error && helperText && (
                <Typography variant="caption" color="error" className="ml-1 block">
                    {helperText}
                </Typography>
            )}
        </Stack>
    );
};
