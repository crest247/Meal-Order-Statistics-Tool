import React from 'react';
import { Trash2 } from 'lucide-react';
import { DraftItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { Stack } from '../../components/ui/Stack';
import { Typography } from '../../components/ui/Typography';

interface DraftListItemProps {
    item: DraftItem;
    onRemove: (id: string) => void;
    variant?: 'primary' | 'secondary';
}

export const DraftListItem: React.FC<DraftListItemProps> = ({
    item,
    onRemove,
    variant = 'primary'
}) => {
    const bgClass = variant === 'primary' ? 'bg-list-item-draft-primary-bg' : 'bg-list-item-draft-secondary-bg';

    return (
        <Stack
            direction="row"
            justify="between"
            align="center"
            className={`${bgClass} p-3 rounded-xl border border-list-item-border`}
        >
            <Stack gap={0}>
                <Typography variant="body2" color="surface" className="font-medium">
                    {item.meal.name}
                </Typography>
                <Typography variant="caption" color="variant">
                    ${item.meal.price} × {item.quantity}
                </Typography>
            </Stack>
            <Stack direction="row" align="center" gap={3}>
                <Typography variant="h3" color="surface">
                    ${item.subtotal}
                </Typography>
                <Button
                    variant="ghost"
                    color="error"
                    isIcon
                    onClick={() => onRemove(item.id)}
                >
                    <Trash2 size={16} />
                </Button>
            </Stack>
        </Stack>
    );
};
