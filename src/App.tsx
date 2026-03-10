import React, { useState, useMemo } from 'react';
import { UserOrder } from './types';
import { OrderSummary } from './features/order-management/OrderSummary';
import { OrderForm } from './features/order-management/OrderForm';
import { EditDialog } from './features/edit-order/EditDialog';
import { Divider } from './components/ui/Divider';
import { PageLayout, GridLayout } from './components/ui/Layout';
import { useMenu } from './hooks/useMenu';
import { useOrders } from './hooks/useOrders';
import { useOrderDraft } from './hooks/useOrderDraft';

export default function App() {
  const { globalMeals, isLoadingMenu } = useMenu();
  const {
    fillerName, setFillerName,
    selectedMealName, setSelectedMealName,
    currentQuantity, setCurrentQuantity,
    fillerDraftList,
    fillerNameError, setFillerNameError,
    selectedMealError, setSelectedMealError,
    fillerTotalPrice,
    handleAddToDraft, handleRemoveFromDraft,
    resetDraft
  } = useOrderDraft(globalMeals);

  const {
    allUsersOrders,
    isSubmitting,
    deletingId,
    isLoadingOrders,
    handleSubmitOrder: submitToApi,
    handleDeleteOrder,
    handleSaveEdit: saveEditToApi
  } = useOrders(resetDraft);

  // --- Edit State ---
  const [editingOrder, setEditingOrder] = useState<UserOrder | null>(null);

  const grandTotalPrice = useMemo(() => {
    return allUsersOrders.reduce((sum, order) => sum + order.total_price, 0);
  }, [allUsersOrders]);

  // --- Actions ---
  const handleSubmitOrder = async () => {
    // Validation Priority 1: Check name
    if (!fillerName.trim()) {
      setFillerNameError(true);
      return;
    }
    setFillerNameError(false);

    // Validation Priority 2: Check if there's at least one item
    if (fillerDraftList.length === 0) {
      setSelectedMealError(true);
      return;
    }
    setSelectedMealError(false);

    const newOrder: UserOrder = {
      filler_name: fillerName.trim(),
      timestamp: (() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      })(),
      items: fillerDraftList,
      total_price: fillerTotalPrice,
    };

    await submitToApi(newOrder);
  };

  const handleSaveEdit = async (updatedOrder: UserOrder) => {
    const success = await saveEditToApi(updatedOrder);
    if (success) {
      setEditingOrder(null);
    }
  };

  return (
    <PageLayout title="訂餐統計系統">
      <GridLayout>
        <OrderSummary
          orders={allUsersOrders}
          grandTotalPrice={grandTotalPrice}
          isLoading={isLoadingOrders}
          deletingId={deletingId}
          onEdit={setEditingOrder}
          onDelete={handleDeleteOrder}
        />

        <Divider mobileOnly variant="thick" />

        <OrderForm
          meals={globalMeals}
          isLoadingMenu={isLoadingMenu}
          isSubmitting={isSubmitting}
          fillerName={fillerName}
          setFillerName={setFillerName}
          fillerNameError={fillerNameError}
          selectedMealName={selectedMealName}
          setSelectedMealName={setSelectedMealName}
          selectedMealError={selectedMealError}
          currentQuantity={currentQuantity}
          setCurrentQuantity={setCurrentQuantity}
          draftList={fillerDraftList}
          onAddToDraft={handleAddToDraft}
          onRemoveFromDraft={handleRemoveFromDraft}
          onSubmit={handleSubmitOrder}
          totalPrice={fillerTotalPrice}
        />
      </GridLayout>

      {editingOrder && (
        <EditDialog
          order={editingOrder}
          meals={globalMeals}
          onClose={() => setEditingOrder(null)}
          onSave={handleSaveEdit}
          isSaving={isSubmitting}
        />
      )}
    </PageLayout>
  );
}
