import React, { useState } from "react";
import { StatusUpdate, User } from "@/types";
import StatusBadge from "./StatusBadge";
import { format, formatDistanceToNow, parseISO, differenceInMinutes, differenceInHours } from "date-fns";
import { 
  ClipboardCheck, 
  Clock, 
  Edit, 
  CheckCircle, 
  Tag, 
  CalendarClock, 
  Undo, 
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import PermissionGated from "./PermissionGated";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { notifyOrderStatusChanged } from '@/utils/notifications';

interface OrderTimelineProps {
  statusHistory: StatusUpdate[];
  currentUser: User;
  canEditStatusUpdate: (update: StatusUpdate) => boolean;
  order: any;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ 
  statusHistory, 
  currentUser,
  canEditStatusUpdate,
  order
}) => {
  const { updateStatusUpdate, undoStatusUpdate, hasPermission } = useOrders();
  const [selectedUpdate, setSelectedUpdate] = useState<StatusUpdate | null>(null);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Format time remaining for edit or undo
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

  // Check if an update is undoable (within 5 minutes for all users)
  const canUndoUpdate = (update: StatusUpdate): boolean => {
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
  const canUserEditStatusUpdate = (update: StatusUpdate): boolean => {
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

  const handleUndoUpdate = async (update: StatusUpdate) => {
    if (!canUndoUpdate(update)) {
      toast.error("This update can no longer be undone");
      return;
    }

    await undoStatusUpdate(update.id);
    toast.success("Status update has been undone");
    await notifyOrderStatusChanged(order.id, order.orderNumber, update.status, order.department);
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
  
  return (
    <div className="space-y-4 mt-4 glass-card p-6 rounded-lg">
      <h3 className="text-lg font-medium flex items-center mb-4">
        <Clock className="h-5 w-5 mr-2" />
        Order Timeline
        <Badge variant="outline" className="ml-auto bg-primary/10 text-primary text-xs">
          {sortedUpdates.length} Updates
        </Badge>
      </h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 ml-3.5 top-0 h-full w-0.5 bg-border"></div>
        
        <div className="space-y-8">
          {sortedUpdates.map((update, index) => (
            <div key={update.id} className="timeline-item relative pl-12">
              {/* Timeline dot with department color */}
              <div className="absolute left-0 mt-1">
                <div className={`h-8 w-8 rounded-full ${getDepartmentStyles(update.department)} flex items-center justify-center z-10 shadow-md transition-all duration-300 hover:scale-110`}>
                  {getDepartmentIcon(update.department)}
                </div>
                
                {/* Connection line to next item */}
                {index < sortedUpdates.length - 1 && (
                  <div className="absolute top-8 left-4 h-8 w-0.5 bg-border"></div>
                )}
              </div>
              
              <div className="flex-1 bg-card/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-border/50 hover:border-border transition-all duration-200">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getDepartmentStyles(update.department)}/20 text-${getDepartmentStyles(update.department).replace('bg-', '')}`}>
                          {update.department}
                        </span>
                        <StatusBadge status={update.status} />
                        {/* Remarks as pill/tab */}
                        {update.remarks && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted/60 border border-border/30 text-xs font-normal text-muted-foreground ml-2">
                            <span className="font-medium text-muted-foreground/80 mr-1">Remarks:</span> {update.remarks}
                          </span>
                        )}
                      </h4>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(update.timestamp)}
                    </span>
                  </div>
                  
                  {update.selectedProduct && (
                    <div className="mt-1.5 flex items-center">
                      <span className="text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <Tag className="h-3 w-3 mr-1" />
                        Product: {order?.productStatus?.find(p => p.id === update.selectedProduct)?.name || update.selectedProduct}
                      </span>
                    </div>
                  )}
                  
                  {update.estimatedTime && (
                    <div className="mt-1.5 flex items-center text-xs text-amber-600 dark:text-amber-400">
                      <CalendarClock className="h-3 w-3 mr-1" />
                      <span>Estimated completion: {update.estimatedTime}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground">
                      Updated by {update.updatedBy}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      {/* Edit button - only show if user can edit */}
                      {canUserEditStatusUpdate(update) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 px-2 text-xs"
                                onClick={() => handleEditStatus(update)}
                              >
                                <Edit className="h-3.5 w-3.5 mr-1" />
                                Edit
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {currentUser.role === "Admin" ? 
                                "Admin can edit anytime" : 
                                "Editable for 1 hour"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {/* Undo button - only show if update can be undone */}
                      {canUndoUpdate(update) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 px-2 text-xs border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:text-amber-600"
                            >
                              <Undo className="h-3.5 w-3.5 mr-1" />
                              Undo
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Undo Status Update</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to undo this status update? This action cannot be reversed.
                                {currentUser.role !== "Admin" && (
                                  <p className="text-amber-500 mt-2 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    Status updates can only be undone within 5 minutes.
                                  </p>
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleUndoUpdate(update)}>
                                Undo Update
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {sortedUpdates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">No updates yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
