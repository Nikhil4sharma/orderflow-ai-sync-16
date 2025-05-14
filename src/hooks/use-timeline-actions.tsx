
import { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { StatusUpdate, Department, OrderStatus, PermissionKey } from '@/types';
import { toast } from 'sonner';
import {
  Calendar,
  Check,
  Clock,
  Edit,
  FileSpreadsheet,
  Forward,
  MoreVertical,
  PenSquare,
  Trash,
  Truck,
  Undo,
} from 'lucide-react';

export interface TimelineAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: (statusUpdate: StatusUpdate) => void;
  showFor: PermissionKey[];
  condition?: (statusUpdate: StatusUpdate) => boolean;
  department?: Department[];
}

export function useTimelineActions() {
  const { updateStatusUpdate, undoStatusUpdate, updateOrder, currentUser } = useOrders();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentStatusUpdate, setCurrentStatusUpdate] = useState<StatusUpdate | null>(null);

  const canEditUpdate = (update: StatusUpdate): boolean => {
    if (!update.editableUntil) return false;
    
    // Check if the edit period has expired
    const editDeadline = new Date(update.editableUntil);
    const now = new Date();
    
    if (now > editDeadline) return false;
    
    // Check if user is the one who created this update
    return update.updatedBy === currentUser?.name;
  };
  
  const canUndoUpdate = (update: StatusUpdate): boolean => {
    // Can only undo your own updates and only if they're recent
    if (!update.timestamp) return false;
    
    const updateTime = new Date(update.timestamp);
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - updateTime.getTime()) / (1000 * 60 * 60);
    
    // Can only undo updates within the last 24 hours
    return hoursSinceUpdate <= 24 && update.updatedBy === currentUser?.name;
  };

  const handleEdit = (statusUpdate: StatusUpdate) => {
    setCurrentStatusUpdate(statusUpdate);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedDetails: Partial<StatusUpdate>) => {
    if (!currentStatusUpdate) return;
    
    updateStatusUpdate(currentStatusUpdate.orderId, currentStatusUpdate.id, updatedDetails);
    setIsEditModalOpen(false);
    setCurrentStatusUpdate(null);
    toast.success('Status update edited successfully');
  };

  const handleUndo = (statusUpdate: StatusUpdate) => {
    undoStatusUpdate(statusUpdate.orderId, statusUpdate.id);
    toast.success('Status update removed');
  };

  const handleForward = (statusUpdate: StatusUpdate) => {
    // Handle forwarding to another department
    toast.info('Forward functionality not implemented yet');
  };

  const handleExport = (statusUpdate: StatusUpdate) => {
    // Export status update to PDF/Excel
    toast.info('Export functionality not implemented yet');
  };

  const handleMarkCompleted = (statusUpdate: StatusUpdate) => {
    // Mark the associated task as completed
    updateStatusUpdate(statusUpdate.orderId, statusUpdate.id, {
      status: 'Completed' as OrderStatus,
    });
    toast.success('Marked as completed');
  };

  const handleActivateDispatch = (statusUpdate: StatusUpdate) => {
    // Set order status to Ready to Dispatch
    updateOrder({
      ...currentStatusUpdate as any, // This will be replaced with proper order data in a real implementation
      status: 'Ready to Dispatch' as OrderStatus,
    });
    toast.success('Order marked as Ready to Dispatch');
  };

  const timelineActions: TimelineAction[] = [
    {
      id: 'edit',
      label: 'Edit Update',
      icon: <Edit className="h-4 w-4" />,
      action: handleEdit,
      showFor: ['update_order_status'],
      condition: canEditUpdate,
    },
    {
      id: 'undo',
      label: 'Remove Update',
      icon: <Undo className="h-4 w-4" />,
      action: handleUndo,
      showFor: ['update_order_status'],
      condition: canUndoUpdate,
    },
    {
      id: 'forward',
      label: 'Forward',
      icon: <Forward className="h-4 w-4" />,
      action: handleForward,
      showFor: ['forward_to_department'],
    },
    {
      id: 'export',
      label: 'Export',
      icon: <FileSpreadsheet className="h-4 w-4" />,
      action: handleExport,
      showFor: ['export_data'],
    },
    {
      id: 'complete',
      label: 'Mark Complete',
      icon: <Check className="h-4 w-4" />,
      action: handleMarkCompleted,
      showFor: ['update_order_status'],
      department: ['Production', 'Design', 'Prepress'],
    },
    {
      id: 'dispatch',
      label: 'Ready to Dispatch',
      icon: <Truck className="h-4 w-4" />,
      action: handleActivateDispatch,
      showFor: ['mark_ready_dispatch'],
      department: ['Production'],
    },
  ];

  return {
    timelineActions,
    isEditModalOpen,
    setIsEditModalOpen,
    currentStatusUpdate,
    setCurrentStatusUpdate,
    handleSaveEdit,
    canEditUpdate,
    canUndoUpdate,
  };
}
