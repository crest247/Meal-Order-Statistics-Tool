import { UserOrder, Meal } from '../types';
import { APP_SCRIPT_WEB_APP_URL } from '../constants';

export interface InitData {
    success: boolean;
    items?: Meal[];
    orders?: any[];
    error?: string;
}

export interface ApiResult {
    success: boolean;
    message?: string;
    error?: string;
}

const isLocalOnly = !APP_SCRIPT_WEB_APP_URL || APP_SCRIPT_WEB_APP_URL.includes('YOUR_APP_SCRIPT');

export const apiService = {
    async fetchInitData(): Promise<InitData> {
        if (isLocalOnly) {
            return { success: true, items: [], orders: [] };
        }
        const res = await fetch(`${APP_SCRIPT_WEB_APP_URL}?action=init`);
        const data = await res.json();
        if (!data.success) {
            alert('獲取資料失敗: ' + (data.error || '未知錯誤'));
        }
        return data;
    },

    async submitOrder(order: UserOrder): Promise<ApiResult> {
        if (isLocalOnly) {
            return { success: true, message: 'Local only: Order saved in memory' };
        }
        const response = await fetch(APP_SCRIPT_WEB_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(order),
        });
        return await response.json();
    },

    async deleteOrder(fillerName: string, timestamp: string): Promise<ApiResult> {
        if (isLocalOnly) {
            return { success: true, message: 'Local only: Order deleted from memory' };
        }
        const response = await fetch(APP_SCRIPT_WEB_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ filler_name: fillerName, timestamp, delete: true }),
        });
        return await response.json();
    },

    async updateOrder(order: UserOrder): Promise<ApiResult> {
        if (isLocalOnly) {
            return { success: true, message: 'Local only: Order updated in memory' };
        }
        const response = await fetch(APP_SCRIPT_WEB_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(order),
        });
        return await response.json();
    }
};
