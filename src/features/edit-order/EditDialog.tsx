import React, { useState, useMemo } from 'react';
import { Meal, DraftItem, UserOrder } from '../../types';
import { generateId, padMealName } from '../../utils/helpers';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { Select } from '../../components/ui/Select';
import { Stack } from '../../components/ui/Stack';
import { Typography } from '../../components/ui/Typography';
import { ScrollArea } from '../../components/ui/ScrollArea';
import { QuantitySelector } from '../../components/ui/QuantitySelector';
import { DraftListItem } from '../order-management/DraftListItem';
import { Scrim } from '../../components/ui/Scrim';

interface EditDialogProps {
    order: UserOrder;
    meals: Meal[];
    onClose: () => void;
    onSave: (o: UserOrder) => void;
    isSaving: boolean;
}

export const EditDialog: React.FC<EditDialogProps> = ({
    order,
    meals,
    onClose,
    onSave,
    isSaving
}) => {
    const [name, setName] = useState(order.filler_name);
    const [draftList, setDraftList] = useState<DraftItem[]>(order.items);

    const [selectedMealId, setSelectedMealId] = useState<string>('');
    const [currentQuantity, setCurrentQuantity] = useState(1);

    const [nameError, setNameError] = useState(false);
    const [mealError, setMealError] = useState(false);

    const selectedMeal = useMemo(() => meals.find(m => m.id === selectedMealId) || null, [selectedMealId, meals]);

    const totalPrice = useMemo(() => {
        return draftList.reduce((sum, item) => sum + item.subtotal, 0);
    }, [draftList]);

    const handleAdd = () => {
        if (!selectedMeal) {
            setMealError(true);
            return;
        }
        if (currentQuantity <= 0) return;

        setMealError(false);
        const newItem: DraftItem = {
            id: generateId(),
            meal: selectedMeal,
            quantity: currentQuantity,
            subtotal: selectedMeal.price * currentQuantity,
        };
        setDraftList(prev => [...prev, newItem]);
        setSelectedMealId('');
        setCurrentQuantity(1);
    };

    const handleRemove = (id: string) => {
        setDraftList(prev => prev.filter(item => item.id !== id));
    };

    const handleSave = () => {
        // Validation Priority 1: Check name
        if (!name.trim()) {
            setNameError(true);
            return;
        }
        setNameError(false);

        // Validation Priority 2: Check if there's at least one item
        if (draftList.length === 0) {
            setMealError(true);
            return;
        }
        setMealError(false);
        onSave({
            ...order,
            filler_name: name.trim(),
            items: draftList,
            total_price: totalPrice,
        });
    };

    return (
        <Scrim onClick={onClose}>
            <Stack
                className="bg-primary-container dialog-surface w-full max-w-md max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <Stack className="p-6 pb-4 border-b border-outline-variant bg-primary-container">
                    <Typography variant="h2" className="text-2xl">編輯訂單</Typography>
                </Stack>

                <ScrollArea className="flex-1">
                    <Stack gap={6} className="p-6">
                        <TextField
                            id="edit_filler_name"
                            label="您的姓名"
                            labelBg="bg-primary-container"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={nameError}
                            helperText="請填寫姓名"
                        />

                        <Stack gap={4} className="bg-primary-surface p-4 rounded-2xl">
                            <Typography variant="body2" color="variant" className="font-medium">新增餐點</Typography>

                            <Select
                                id="edit_meal_sel"
                                label="選擇餐點"
                                labelBg="bg-primary-surface"
                                value={selectedMealId}
                                onChange={(e) => setSelectedMealId(e.target.value)}
                                error={mealError}
                                helperText="請選擇餐點"
                                disabled={meals.length === 0}
                            >
                                {meals.length === 0 ? (
                                    <option className="font-sans">載入選單中...</option>
                                ) : (
                                    <>
                                        <option value="" disabled className="font-sans">請選擇餐點</option>
                                        {meals.map(meal => (
                                            <option key={meal.id} value={meal.id}>
                                                {padMealName(meal.name)} ${String(meal.price).padStart(3, '\u00A0')}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </Select>

                            <Stack direction="row" align="center" justify="between">
                                <QuantitySelector value={currentQuantity} onChange={setCurrentQuantity} />
                                <Button
                                    variant="primary"
                                    onClick={handleAdd}
                                    disabled={!selectedMeal || currentQuantity <= 0 || isSaving}
                                    className="w-auto px-5 py-2 text-sm"
                                >
                                    加入
                                </Button>
                            </Stack>
                        </Stack>

                        <Stack gap={3}>
                            <Typography variant="body2" color="variant" className="font-medium">已選餐點：</Typography>
                            <Stack gap={2}>
                                {draftList.map(item => (
                                    <DraftListItem
                                        key={item.id}
                                        item={item}
                                        onRemove={handleRemove}
                                        variant="primary"
                                    />
                                ))}
                            </Stack>
                        </Stack>
                    </Stack>
                </ScrollArea>

                <Stack
                    direction="row"
                    justify="between"
                    align="center"
                    className="p-6 pt-4 border-t border-outline-variant bg-primary-container"
                >
                    <Typography variant="h3">
                        總計: <Typography color="primary" className="font-bold">${totalPrice}</Typography>
                    </Typography>
                    <Stack direction="row" gap={2}>
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="w-auto px-6 py-2.5 text-primary"
                        >
                            取消
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-auto px-6 py-2.5"
                        >
                            {isSaving ? (
                                <Stack direction="row" align="center" gap={2}>
                                    <LoadingSpinner size={18} />
                                    正在儲存...
                                </Stack>
                            ) : '儲存'}
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Scrim>
    );
};
