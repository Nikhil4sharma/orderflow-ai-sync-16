
import React from "react";
import { StatusUpdate, User } from "@/types";
import StatusBadge from "./StatusBadge";
import { format, formatDistanceToNow } from "date-fns";
import { ClipboardCheck, Clock, Edit, CheckCircle, Tag } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface OrderTimelineProps {
  statusHistory: StatusUpdate[];
  currentUser: User;
  canEditStatusUpdate: (update: StatusUpdate) => boolean;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ 
  statusHistory, 
  currentUser,
  canEditStatusUpdate 
}) => {
  const { updateStatusUpdate } = useOrders();
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Format time remaining for edit
  const formatTimeRemaining = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  // Sort updates by timestamp in descending order
  const sortedUpdates = statusHistory ? [...statusHistory].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ) : [];

  const handleEditStatus = (update: StatusUpdate) => {
    // This would open a modal or form for editing
    toast.info("Edit functionality would be implemented here");
    
    // For demonstration, we'll just show that edit is possible
    // In a real implementation, you'd have a modal or inline edit form
    console.log("Editing status update:", update);
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

  return (
    <div className="space-y-4 mt-4 glass-card p-6 rounded-lg">
      <h3 className="text-lg font-medium">Order Timeline</h3>
      <div className="space-y-6">
        {sortedUpdates.map((update) => (
          <div key={update.id} className="timeline-item">
            <div className="flex items-start mb-1">
              <div className="mr-4 mt-1">
                <div className={`h-8 w-8 rounded-full ${getDepartmentStyles(update.department)} flex items-center justify-center`}>
                  {getDepartmentIcon(update.department)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">
                    {update.department} - <StatusBadge status={update.status} />
                    {update.selectedProduct && (
                      <span className="ml-2 text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <Tag className="h-3 w-3 mr-1" />
                        Product Update
                      </span>
                    )}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(update.timestamp)}
                  </span>
                </div>
                {update.remarks && (
                  <p className="text-sm mt-1">{update.remarks}</p>
                )}
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">
                    Updated by {update.updatedBy}
                  </p>
                  
                  {canEditStatusUpdate(update) && update.updatedBy === currentUser.name && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 text-amber-500 mr-1" />
                      <span className="text-xs text-amber-500 mr-2">
                        Editable {formatTimeRemaining(update.editableUntil || '')}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-xs"
                        onClick={() => handleEditStatus(update)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {sortedUpdates.length === 0 && (
          <p className="text-muted-foreground text-sm">No updates yet</p>
        )}
      </div>
    </div>
  );
};

export default OrderTimeline;
