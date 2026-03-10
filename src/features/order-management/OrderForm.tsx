import React, { useMemo } from 'react';
import { CloudUpload, Plus } from 'lucide-react';
import { Meal, DraftItem } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Card } from '../../components/ui/Card';
import { TextField } from '../../components/ui/TextField';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Stack } from '../../components/ui/Stack';
import { Typography } from '../../components/ui/Typography';
import { ScrollArea } from '../../components/ui/ScrollArea';
import { QuantitySelector } from '../../components/ui/QuantitySelector';
import { DraftListItem } from './DraftListItem';
import { padMealName } from '../../utils/helpers';

interface OrderFormProps {
    meals: Meal[];
    isLoadingMenu: boolean;
    isSubmitting: boolean;

    fillerName: string;
    setFillerName: (name: string) => void;
    fillerNameError: boolean;

    selectedMealName: string;
    setSelectedMealName: (name: string) => void;
    selectedMealError: boolean;

    currentQuantity: number;
    setCurrentQuantity: (q: number | ((prev: number) => number)) => void;

    draftList: DraftItem[];
    onAddToDraft: () => void;
    onRemoveFromDraft: (id: string) => void;
    onSubmit: () => void;
    totalPrice: number;
}

export const OrderForm: React.FC<OrderFormProps> = ({
    meals,
    isLoadingMenu,
    isSubmitting,
    fillerName,
    setFillerName,
    fillerNameError,
    selectedMealName,
    setSelectedMealName,
    selectedMealError,
    currentQuantity,
    setCurrentQuantity,
    draftList,
    onAddToDraft,
    onRemoveFromDraft,
    onSubmit,
    totalPrice,
}) => {
    const selectedMeal = useMemo(() => meals.find(m => m.name === selectedMealName) || null, [selectedMealName, meals]);

    return (
        <Card variant="primary" className="h-fit">
            <Typography variant="h2" className="mb-6">新增個人訂單</Typography>

            <Stack gap={6}>
                <TextField
                    id="filler_name"
                    label="您的姓名"
                    labelBg="bg-primary-container"
                    value={fillerName}
                    onChange={(e) => setFillerName(e.target.value)}
                    error={fillerNameError}
                    helperText="請填寫姓名"
                />

                <Select
                    id="meal_selector"
                    label="選擇餐點"
                    labelBg="bg-primary-container"
                    value={selectedMealName}
                    onChange={(e) => setSelectedMealName(e.target.value)}
                    error={selectedMealError}
                    helperText="請選擇餐點"
                    disabled={isLoadingMenu || meals.length === 0}
                >
                    {isLoadingMenu ? (
                        <option className="font-sans">正在同步餐點清單...</option>
                    ) : meals.length === 0 ? (
                        <option className="font-sans">暫無餐點資料</option>
                    ) : (
                        <>
                            <option value="" disabled className="font-sans">請選擇餐點</option>
                            {meals.map(meal => (
                                <option key={meal.name} value={meal.name}>
                                    {padMealName(meal.name)} ${String(meal.price).padStart(3, '\u00A0')}
                                </option>
                            ))}
                        </>
                    )}
                </Select>

                <Stack direction="row" align="center" gap={4}>
                    <Typography variant="body2" color="variant" className="font-medium">數量</Typography>
                    <QuantitySelector value={currentQuantity} onChange={setCurrentQuantity} />
                </Stack>

                <Button
                    onClick={onAddToDraft}
                    disabled={!selectedMeal || currentQuantity <= 0 || isSubmitting}
                >
                    <Plus size={20} />
                    加入個人清單
                </Button>

                <Stack gap={0} className="mt-8 pt-6 border-t border-outline-variant">
                    <Typography variant="body2" color="variant" className="font-medium mb-3">
                        目前已選餐點：
                    </Typography>

                    <ScrollArea maxHeight="192px" className="mb-4">
                        <Stack gap={2}>
                            {draftList.length === 0 ? (
                                <Typography variant="body2" color="outline" className="italic">
                                    尚未加入任何餐點
                                </Typography>
                            ) : (
                                draftList.map(item => (
                                    <DraftListItem
                                        key={item.id}
                                        item={item}
                                        onRemove={onRemoveFromDraft}
                                        variant="primary"
                                    />
                                ))
                            )}
                        </Stack>
                    </ScrollArea>

                    <Stack direction="row" justify="end" className="mb-6">
                        <Typography variant="h3">
                            您的總價：<Typography color="primary" className="font-bold">${totalPrice}</Typography>
                        </Typography>
                    </Stack>

                    <Button
                        onClick={onSubmit}
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Stack direction="row" align="center" gap={2}>
                                <LoadingSpinner size={20} />
                                正在送出...
                            </Stack>
                        ) : (
                            <Stack direction="row" align="center" gap={2}>
                                <CloudUpload size={20} />
                                送出訂單
                            </Stack>
                        )}
                    </Button>
                </Stack>
            </Stack>
        </Card>
    );
};
