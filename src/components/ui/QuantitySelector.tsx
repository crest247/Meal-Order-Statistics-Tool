import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Stack } from './Stack';
import { Typography } from './Typography';

interface QuantitySelectorProps {
    value: number;
    onChange: (value: number | ((prev: number) => number)) => void;
    min?: number;
    className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    value,
    onChange,
    min = 1,
    className = ''
}) => {
    return (
        <Stack
            direction="row"
            align="center"
            className={`bg-quantity-selector-container-bg rounded-full border border-quantity-selector-border p-1 shadow-sm ${className}`}
            gap={2}
        >
            <button
                onClick={() => value > min && onChange(v => (typeof v === 'number' ? v - 1 : v(v)))}
                disabled={value <= min}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-quantity-selector-bg text-quantity-selector-text hover:bg-quantity-selector-btn-hover disabled:opacity-30 disabled:hover:bg-quantity-selector-bg transition-colors active:scale-95"
            >
                <Minus size={16} />
            </button>
            <Typography variant="h3" className="w-8 text-center font-medium">
                {value}
            </Typography>
            <button
                onClick={() => onChange(v => (typeof v === 'number' ? v + 1 : v(v)))}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-quantity-selector-bg text-quantity-selector-text hover:bg-quantity-selector-btn-hover transition-colors active:scale-95"
            >
                <Plus size={16} />
            </button>
        </Stack>
    );
};
