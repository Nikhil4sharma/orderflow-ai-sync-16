
import React from "react";
import { StatusUpdate, User } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import { format, formatDistanceToNow, differenceInMinutes, differenceInHours } from "date-fns";
import { Edit, Undo, AlertCircle, Clock, Tag, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useTimelineActions } from "@/hooks/use-timeline-actions";

interface TimelineItemProps {
  update: StatusUpdate;
  index: number;
  totalItems: number;
  currentUser: User;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ 
  update, 
  index,
  totalItems,
  currentUser 
}) => {
  const { 
    formatDate,
    isRecentUpdate,
    canUndoUpdate,
    canUserEditStatusUpdate,
    handleEditStatus,
    handleUndoUpdate,
    getDepartmentStyles,
    getDepartmentIcon
  } = useTimelineActions();

  return (
    <div className="timeline-item relative pl-12">
      {/* Timeline dot with department color */}
      <div className="absolute left-0 mt-1">
        <div className={`h-8 w-8 rounded-full ${getDepartmentStyles(update.department)} flex items-center justify-center z-10 shadow-md transition-all duration-300 hover:scale-110`}>
          {getDepartmentIcon(update.department)}
        </div>
        
        {/* Connection line to next item */}
        {index < totalItems - 1 && (
          <div className="absolute top-8 left-4 h-8 w-0.5 bg-border"></div>
        )}
      </div>
      
      <div className="flex-1 bg-card/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-border/50 hover:border-border transition-all duration-200">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <h4 className="text-sm font-medium flex items-center">
                <span className={`px-2 py-0.5 rounded-full text-xs mr-2 ${getDepartmentStyles(update.department)}/20 text-${getDepartmentStyles(update.department).replace('bg-', '')}`}>
                  {update.department}
                </span>
                <StatusBadge status={update.status} />
                
                {isRecentUpdate(update) && (
                  <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-sm">
                    New
                  </span>
                )}
              </h4>
            </div>
            
            <span className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(update.timestamp)}
            </span>
          </div>
          
          {update.remarks && (
            <p className="text-sm mt-1 text-foreground/80">{update.remarks}</p>
          )}
          
          {update.selectedProduct && (
            <div className="mt-1.5 flex items-center">
              <span className="text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <Tag className="h-3 w-3 mr-1" />
                Product: {update.selectedProduct}
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
              {canUserEditStatusUpdate(update, currentUser) && (
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
              {canUndoUpdate(update, currentUser) && (
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
  );
};

export default TimelineItem;
