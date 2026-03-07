import { useState, useEffect } from 'react';
import { Meal } from '../types';
import { apiService } from '../services/api';

export function useMenu() {
    const [globalMeals, setGlobalMeals] = useState<Meal[]>([]);
    const [isLoadingMenu, setIsLoadingMenu] = useState(true);

    useEffect(() => {
        const loadMenu = async () => {
            try {
                const data = await apiService.fetchInitData();
                if (data.success && data.items) {
                    setGlobalMeals(data.items);
                }
            } catch (err) {
                console.error('Menu Load Error:', err);
            } finally {
                setIsLoadingMenu(false);
            }
        };

        loadMenu();
    }, []);

    return { globalMeals, isLoadingMenu, setGlobalMeals };
}
