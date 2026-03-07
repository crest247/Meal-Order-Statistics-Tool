import { useState, useEffect } from 'react';
import { UserOrder } from '../types';
import { apiService } from '../services/api';

export function useOrders(onResetForm?: () => void) {
    const [allUsersOrders, setAllUsersOrders] = useState<UserOrder[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await apiService.fetchInitData();
                if (data.success && data.orders) {
                    const mappedOrders: UserOrder[] = data.orders.map((o: any) => ({
                        id: o.id,
                        filler_name: o.filler_name,
                        total_price: o.total_price,
                        items: o.items || [],
                        _summary: o.items_summary || '無餐點明細'
                    }));
                    setAllUsersOrders(mappedOrders);
                }
            } catch (err) {
                console.error('Orders Load Error:', err);
            } finally {
                setIsLoadingOrders(false);
            }
        };

        loadOrders();
    }, []);

    const handleSubmitOrder = async (newOrder: UserOrder) => {
        setIsSubmitting(true);
        try {
            const data = await apiService.submitOrder(newOrder);
            if (data.success) {
                setAllUsersOrders(prev => [...prev, newOrder]);
                if (onResetForm) onResetForm();
                return true;
            } else {
                alert('提交失敗: ' + (data.error || '未知錯誤'));
                return false;
            }
        } catch (error) {
            console.error('Submit Error:', error);
            alert('發生網路錯誤，請稍後再試。');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteOrder = async (id: string) => {
        if (!window.confirm('確定要刪除這筆訂單嗎？')) return;

        setDeletingId(id);
        try {
            const data = await apiService.deleteOrder(id);
            if (data.success) {
                setAllUsersOrders(prev => prev.filter(o => o.id !== id));
            } else {
                alert('刪除失敗: ' + (data.error || '未知錯誤'));
            }
        } catch (error) {
            console.error('Delete Error:', error);
            alert('網路錯誤，無法從雲端刪除。');
        } finally {
            setDeletingId(null);
        }
    };

    const handleSaveEdit = async (updatedOrder: UserOrder) => {
        setIsSubmitting(true);
        try {
            const data = await apiService.updateOrder(updatedOrder);
            if (data.success) {
                setAllUsersOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
                return true;
            } else {
                alert('更新失敗: ' + (data.error || '未知錯誤'));
                return false;
            }
        } catch (error) {
            console.error('Update Error:', error);
            alert('網路錯誤，無法同步至雲端。');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        allUsersOrders,
        isSubmitting,
        deletingId,
        isLoadingOrders,
        handleSubmitOrder,
        handleDeleteOrder,
        handleSaveEdit
    };
}
