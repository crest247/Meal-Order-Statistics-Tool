import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { UserOrder } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Stack } from '../../components/ui/Stack';
import { Typography } from '../../components/ui/Typography';
import { ScrollArea } from '../../components/ui/ScrollArea';
import { OrderListItem } from './OrderListItem';

interface OrderSummaryProps {
    orders: UserOrder[];
    grandTotalPrice: number;
    isLoading: boolean;
    deletingId: string | null;
    onEdit: (order: UserOrder) => void;
    onDelete: (fillerName: string, timestamp: string) => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    orders,
    grandTotalPrice,
    isLoading,
    deletingId,
    onEdit,
    onDelete,
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <Card variant="secondary" className="h-fit">
            <Stack
                direction="row"
                justify="between"
                align="center"
                className="mb-6 cursor-pointer select-none"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <Stack direction="row" align="center" gap={3}>
                    <Typography variant="h2">所有人的訂單們</Typography>
                    {!isLoading && orders.length > 0 && (
                        <Badge variant="secondary">
                            總計: ${grandTotalPrice}
                        </Badge>
                    )}
                </Stack>
                <button className="p-1 rounded-full text-on-surface-variant hover:bg-on-surface/8 transition-colors">
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>
            </Stack>

            {isExpanded && (
                <Stack className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <ScrollArea maxHeight="600px">
                        <Stack gap={4}>
                            {isLoading ? (
                                <Stack
                                    align="center"
                                    justify="center"
                                    gap={2}
                                    className="p-4 bg-secondary-surface rounded-2xl border border-secondary/10"
                                >
                                    <LoadingSpinner size={20} className="text-secondary" />
                                    <Typography variant="body1" color="variant">正在同步雲端資料...</Typography>
                                </Stack>
                            ) : orders.length === 0 ? (
                                <Typography
                                    variant="body1"
                                    color="variant"
                                    className="italic p-4 text-center bg-secondary-surface rounded-2xl border border-secondary/10"
                                >
                                    目前還沒有人點餐喔！
                                </Typography>
                            ) : (
                                orders.map(order => (
                                    <OrderListItem
                                        key={`${order.filler_name}-${order.timestamp}`}
                                        order={order}
                                        isDeleting={deletingId === `${order.filler_name}-${order.timestamp}`}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                ))
                            )}
                        </Stack>
                    </ScrollArea>
                </Stack>
            )}
        </Card>
    );
};
