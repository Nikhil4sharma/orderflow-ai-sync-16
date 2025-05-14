
import React from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { toast } from 'sonner';
import { StatusUpdate, Order } from '@/types';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { nanoid } from 'nanoid';
import { notifyOrderStatusChanged } from '@/utils/notifications';
import { 
  Clipboard, 
  FileText, 
  ShoppingBag,
  Paint, 
  Printer, 
  Package,
  Settings
} from 'lucide-react';

export function useTimelineActions() {
  const { orders, updateOrder, currentUser } = useOrders();

  // Format date for timeline display
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  // Check if update is recent (within last hour)
  const isRecentUpdate = (update: StatusUpdate): boolean => {
    const now = new Date();
    const updateTime = new Date(update.timestamp);
    const diffMs = now.getTime() - updateTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins <= 60;
  };
  
  // Check if user can undo an update
  const canUndoUpdate = (update: StatusUpdate, currentUser: any): boolean => {
    // Admin can undo any time
    if (currentUser?.role === 'Admin') {
      return true;
    }
    
    // Users can undo their own updates for 5 minutes
    if (update.updatedBy === currentUser?.name) {
      const now = new Date();
      const updateTime = new Date(update.timestamp);
      const diffMs = now.getTime() - updateTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      return diffMins <= 5;
    }
    
    return false;
  };
  
  // Check if user can edit a status update
  const canUserEditStatusUpdate = (update: StatusUpdate, currentUser: any): boolean => {
    // Admin can edit anytime
    if (currentUser?.role === 'Admin') {
      return true;
    }
    
    // Users can edit their own updates within the editable window
    if (update.updatedBy === currentUser?.name && update.editableUntil) {
      const now = new Date();
      const editableUntil = new Date(update.editableUntil);
      return now <= editableUntil;
    }
    
    return false;
  };
  
  // Handle edit status action (stub - this would be connected to your edit modal)
  const handleEditStatus = (update: StatusUpdate) => {
    // This function would open your edit modal with the update data
    // This is a stub implementation
    console.log('Edit status:', update);
  };
  
  // Handle undo update action
  const handleUndoUpdate = async (update: StatusUpdate) => {
    try {
      await removeStatusUpdate(update.orderId, update.id);
    } catch (error) {
      console.error('Error undoing update:', error);
      toast.error('Failed to undo update');
    }
  };
  
  // Get department-specific styles for UI
  const getDepartmentStyles = (department: string) => {
    switch (department) {
      case 'Sales':
        return 'bg-blue-500';
      case 'Design':
        return 'bg-purple-500';
      case 'Prepress':
        return 'bg-amber-500';
      case 'Production':
        return 'bg-green-500';
      case 'Admin':
        return 'bg-gray-500';
      default:
        return 'bg-slate-500';
    }
  };
  
  // Get department-specific icon
  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'Sales':
        return <ShoppingBag className="h-4 w-4 text-white" />;
      case 'Design':
        return <Paint className="h-4 w-4 text-white" />;
      case 'Prepress':
        return <FileText className="h-4 w-4 text-white" />;
      case 'Production':
        return <Printer className="h-4 w-4 text-white" />;
      case 'Admin':
        return <Settings className="h-4 w-4 text-white" />;
      default:
        return <Clipboard className="h-4 w-4 text-white" />;
    }
  };

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

    // Ensure new data won't break type safety
    const safeNewData = {
      ...newData,
      department: newData.department || undefined,
      status: newData.status || undefined,
    };

    const updatedHistory = order.statusHistory.map(update => 
      update.id === updateId
        ? { 
            ...update, 
            ...safeNewData,
            metadata: {
              updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
              updatedBy: currentUser?.name || 'Unknown',
              department: currentUser?.department || 'Unknown',
              role: currentUser?.role || 'Unknown',
            }
          }
        : update
    );
    
    try {
      await updateOrder({
        ...order,
        statusHistory: updatedHistory as StatusUpdate[],
      });
      
      if (newData.status) {
        await notifyOrderStatusChanged(
          orderId, 
          order.orderNumber, 
          newData.status, 
          currentUser?.department || ''
        );
      }
      
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
      status: status as any,
      remarks: remarks,
      updatedBy: currentUser?.name || 'Unknown',
      editableUntil: format(new Date(Date.now() + 30 * 60000), 'yyyy-MM-dd HH:mm:ss'),
    };

    const updatedHistory = [...(order.statusHistory || []), newUpdate];
    
    try {
      await updateOrder({
        ...order,
        statusHistory: updatedHistory,
        status: status as any,
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
    formatDate,
    isRecentUpdate,
    canUndoUpdate,
    canUserEditStatusUpdate,
    handleEditStatus,
    handleUndoUpdate,
    getDepartmentStyles,
    getDepartmentIcon
  };
}
