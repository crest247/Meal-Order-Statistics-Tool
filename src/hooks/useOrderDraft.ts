import { useState, useMemo } from 'react';
import { Meal, DraftItem } from '../types';
import { generateId } from '../utils/helpers';

export function useOrderDraft(globalMeals: Meal[]) {
    const [fillerName, setFillerName] = useState('');
    const [selectedMealId, setSelectedMealId] = useState<string>('');
    const [currentQuantity, setCurrentQuantity] = useState(1);
    const [fillerDraftList, setFillerDraftList] = useState<DraftItem[]>([]);

    // Validation State
    const [fillerNameError, setFillerNameError] = useState(false);
    const [selectedMealError, setSelectedMealError] = useState(false);

    const fillerTotalPrice = useMemo(() => {
        return fillerDraftList.reduce((sum, item) => sum + item.subtotal, 0);
    }, [fillerDraftList]);

    const handleAddToDraft = () => {
        const selectedMeal = globalMeals.find(m => m.id === selectedMealId);
        if (!selectedMeal) {
            setSelectedMealError(true);
            return;
        }
        if (currentQuantity <= 0) return;

        setSelectedMealError(false);
        const newItem: DraftItem = {
            id: generateId(),
            meal: selectedMeal,
            quantity: currentQuantity,
            subtotal: selectedMeal.price * currentQuantity,
        };

        setFillerDraftList(prev => [...prev, newItem]);
        setSelectedMealId('');
        setCurrentQuantity(1);
    };

    const handleRemoveFromDraft = (id: string) => {
        setFillerDraftList(prev => prev.filter(item => item.id !== id));
    };

    const resetDraft = () => {
        setFillerName('');
        setFillerDraftList([]);
        setSelectedMealId('');
        setCurrentQuantity(1);
        setFillerNameError(false);
        setSelectedMealError(false);
    };

    return {
        fillerName,
        setFillerName,
        selectedMealId,
        setSelectedMealId,
        currentQuantity,
        setCurrentQuantity,
        fillerDraftList,
        fillerNameError,
        setFillerNameError,
        selectedMealError,
        setSelectedMealError,
        fillerTotalPrice,
        handleAddToDraft,
        handleRemoveFromDraft,
        resetDraft
    };
}
