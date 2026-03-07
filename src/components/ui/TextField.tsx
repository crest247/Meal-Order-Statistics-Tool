import React from 'react';
import { Stack } from './Stack';
import { Typography } from './Typography';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    labelBg?: string;
    error?: boolean;
    helperText?: string;
    containerClassName?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
    label,
    labelBg = 'bg-surface',
    error,
    helperText,
    id,
    className = '',
    containerClassName = '',
    ...props
}) => {
    return (
        <Stack gap={1} className={containerClassName}>
            <Stack className="relative">
                <input
                    id={id}
                    className={`block w-full px-4 py-3.5 text-base text-input-text bg-transparent border ${error ? 'border-input-border-error focus:ring-input-border-error' : 'border-input-border focus:ring-input-border-focus'} rounded-[4px] appearance-none focus:outline-none focus:ring-2 focus:border-transparent peer ${className}`}
                    placeholder=" "
                    {...props}
                />
                <label
                    htmlFor={id}
                    className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] ${labelBg} px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 pointer-events-none 
            ${error ? 'text-input-border-error peer-focus:text-input-border-error' : 'text-input-label peer-focus:text-input-label-focus'}`}
                >
                    {label}
                </label>
            </Stack>
            {error && helperText && (
                <Typography variant="caption" color="error" className="ml-1 block">
                    {helperText}
                </Typography>
            )}
        </Stack>
    );
};
