
import React from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { toast } from 'sonner';
import { StatusUpdate, Order } from '@/types';
import { format } from 'date-fns';
import { nanoid } from 'nanoid';
import { notifyOrderStatusChanged } from '@/utils/notifications';

export function useTimelineActions() {
  const { orders, updateOrder, currentUser } = useOrders();

  const canEditStatusUpdate = (update: StatusUpdate): boolean => {
    // Admin can edit any time
    if (currentUser?.role === 'Admin') {
      return true;
    }

    // Users can edit their own updates for 30 minutes
    if (update.updatedBy === currentUser?.name) {
      const now = new Date();
      const updateTime = new Date(update.timestamp);
      const diffMs = now.getTime() - updateTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      return diffMins <= 30;
    }

    return false;
  };

  const removeStatusUpdate = async (orderId: string, updateId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      toast.error('Order not found');
      return;
    }

    const updatedHistory = order.statusHistory.filter(update => update.id !== updateId);
    
    try {
      await updateOrder({
        ...order,
        statusHistory: updatedHistory,
      });
      toast.success('Status update removed successfully');
    } catch (error) {
      console.error('Error removing status update:', error);
      toast.error('Failed to remove status update');
    }
  };

  const editStatusUpdate = async (orderId: string, updateId: string, newData: Partial<StatusUpdate>) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      toast.error('Order not found');
      return;
    }

    const updatedHistory = order.statusHistory.map(update => 
      update.id === updateId
        ? { ...update, ...newData, metadata: {
            updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            updatedBy: currentUser?.name || 'Unknown',
            department: currentUser?.department || 'Unknown',
            role: currentUser?.role || 'Unknown',
          }}
        : update
    );
    
    try {
      await updateOrder({
        ...order,
        statusHistory: updatedHistory,
      });
      
      await notifyOrderStatusChanged(
        orderId, 
        order.orderNumber, 
        newData.status || '',
        currentUser?.department || ''
      );
      
      toast.success('Status update edited successfully');
    } catch (error) {
      console.error('Error editing status update:', error);
      toast.error('Failed to edit status update');
    }
  };

  const addStatusUpdate = async (order: Order, status: string, remarks: string = '') => {
    if (!order) {
      toast.error('Order not found');
      return;
    }

    const newUpdate: StatusUpdate = {
      id: nanoid(),
      orderId: order.id,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      department: currentUser?.department || 'Unknown',
      status: status,
      remarks: remarks,
      updatedBy: currentUser?.name || 'Unknown',
      editableUntil: format(new Date(Date.now() + 30 * 60000), 'yyyy-MM-dd HH:mm:ss'),
    };

    const updatedHistory = [...(order.statusHistory || []), newUpdate];
    
    try {
      await updateOrder({
        ...order,
        statusHistory: updatedHistory,
        status: status,
      });
      
      await notifyOrderStatusChanged(
        order.id,
        order.orderNumber,
        status,
        currentUser?.department || ''
      );
      
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error adding status update:', error);
      toast.error('Failed to update status');
    }
  };

  return {
    canEditStatusUpdate,
    removeStatusUpdate,
    editStatusUpdate,
    addStatusUpdate,
  };
}
