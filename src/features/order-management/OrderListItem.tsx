import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { UserOrder } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Stack } from '../../components/ui/Stack';
import { Typography } from '../../components/ui/Typography';
import { Scrim } from '../../components/ui/Scrim';

interface OrderListItemProps {
    order: UserOrder;
    isDeleting: boolean;
    onEdit: (order: UserOrder) => void;
    onDelete: (fillerName: string, timestamp: string) => void;
}

export const OrderListItem: React.FC<OrderListItemProps> = ({
    order,
    isDeleting,
    onEdit,
    onDelete,
}) => {
    return (
        <Stack
            className={`bg-list-item-order-bg list-item-surface p-4 shadow-sm border border-list-item-border relative transition-opacity ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
        >
            {isDeleting && (
                <Scrim absolute blur={false} darken={false} className="bg-white/10">
                    <Stack align="center" gap={2}>
                        <LoadingSpinner size={24} className="text-secondary" />
                        <Typography variant="caption" color="secondary">同步刪除中...</Typography>
                    </Stack>
                </Scrim>
            )}
            <Stack gap={3}>
                <Stack direction="row" justify="between" align="start">
                    <Stack direction="row" align="center" gap={3}>
                        <Typography variant="h3" color="surface">
                            {order.filler_name}
                        </Typography>
                        <Badge variant="outline">
                            ${order.total_price}
                        </Badge>
                    </Stack>
                    <Stack direction="row" gap={1} className="-mt-1 -mr-1">
                        <Button
                            variant="ghost"
                            isIcon
                            onClick={() => onEdit(order)}
                            aria-label="編輯訂單"
                        >
                            <Edit size={18} />
                        </Button>
                        <Button
                            variant="ghost"
                            color="error"
                            isIcon
                            onClick={() => onDelete(order.filler_name, order.timestamp)}
                            aria-label="刪除訂單"
                        >
                            <Trash2 size={18} />
                        </Button>
                    </Stack>
                </Stack>

                <Stack gap={1}>
                    {order.items.length > 0 ? (
                        order.items.map(item => (
                            <Stack key={item.id} direction="row" justify="between">
                                <Typography variant="body2" color="variant">
                                    {item.meal.name} <Typography color="outline">× {item.quantity}</Typography>
                                </Typography>
                                <Typography variant="body2" color="variant">
                                    ${item.subtotal}
                                </Typography>
                            </Stack>
                        ))
                    ) : (
                        <Typography variant="body2" color="variant" className="whitespace-pre-wrap">
                            {order._summary || '無餐點明細'}
                        </Typography>
                    )}
                </Stack>
            </Stack>
        </Stack>
    );
};
