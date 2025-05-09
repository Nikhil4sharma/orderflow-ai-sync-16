
import { useState } from "react";
import { StatusUpdate, User } from "@/types";
import { toast } from "sonner";
import { differenceInMinutes, differenceInHours, format } from "date-fns";
import { useOrders } from "@/contexts/OrderContext";
import { ClipboardCheck, CheckCircle, Tag } from "lucide-react";

export function useTimelineActions() {
  const { updateStatusUpdate, undoStatusUpdate } = useOrders();
  const [selectedUpdate, setSelectedUpdate] = useState<StatusUpdate | null>(null);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Check if an update is undoable (within 5 minutes for all users)
  const canUndoUpdate = (update: StatusUpdate, currentUser: User): boolean => {
    if (!update.timestamp) return false;
    
    const createdAt = new Date(update.timestamp);
    const now = new Date();
    const minutesDiff = differenceInMinutes(now, createdAt);
    
    // Admin can undo any updates
    if (currentUser.role === "Admin") return true;
    
    // Regular users can only undo their own updates within 5 minutes
    return minutesDiff <= 5 && update.updatedBy === currentUser.name;
  };

  // Check if status update can be edited (1 hour for regular users, unlimited for admin)
  const canUserEditStatusUpdate = (update: StatusUpdate, currentUser: User): boolean => {
    // Admin can edit any updates
    if (currentUser.role === "Admin") return true;
    
    // For other users, check the time limit (1 hour) and ownership
    if (update.updatedBy !== currentUser.name) return false;
    
    const createdAt = new Date(update.timestamp);
    const now = new Date();
    const hoursDiff = differenceInHours(now, createdAt);
    
    return hoursDiff <= 1;
  };

  const handleEditStatus = (update: StatusUpdate) => {
    // This would open a modal or form for editing
    setSelectedUpdate(update);
    // For now, we'll just show a toast. In a real implementation, you'd have a modal or inline edit form
    toast.info("Edit functionality would be implemented here");
    console.log("Editing status update:", update);
  };

  const handleUndoUpdate = (update: StatusUpdate) => {
    if (!canUndoUpdate(update, { role: "Admin" } as User)) {
      toast.error("This update can no longer be undone");
      return;
    }

    undoStatusUpdate(update.id);
    toast.success("Status update has been undone");
  };

  // Get department-specific styles for visual differentiation
  const getDepartmentStyles = (department: string) => {
    switch (department) {
      case "Design":
        return "bg-blue-500";
      case "Production":
        return "bg-amber-500";
      case "Prepress":
        return "bg-purple-500";
      case "Sales":
        return "bg-green-500";
      default:
        return "bg-primary";
    }
  };
  
  // Get department-specific icon for visual differentiation
  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case "Design":
        return <Tag className="h-5 w-5 text-white" />;
      case "Production":
        return <CheckCircle className="h-5 w-5 text-white" />;
      case "Prepress":
        return <ClipboardCheck className="h-5 w-5 text-white" />;
      case "Sales":
        return <ClipboardCheck className="h-5 w-5 text-white" />;
      default:
        return <ClipboardCheck className="h-5 w-5 text-white" />;
    }
  };

  // Calculate if an update is recent (less than 1 hour old)
  const isRecentUpdate = (update: StatusUpdate): boolean => {
    if (!update.timestamp) return false;
    
    const createdAt = new Date(update.timestamp);
    const now = new Date();
    const hoursDiff = differenceInHours(now, createdAt);
    
    return hoursDiff < 1;
  };

  return {
    formatDate,
    canUndoUpdate,
    canUserEditStatusUpdate,
    handleEditStatus,
    handleUndoUpdate,
    getDepartmentStyles,
    getDepartmentIcon,
    isRecentUpdate,
    selectedUpdate,
    setSelectedUpdate
  };
}
