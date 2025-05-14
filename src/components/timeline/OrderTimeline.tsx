
import React from "react";
import { StatusUpdate, User, OrderStatus } from "@/types";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TimelineItem from "./TimelineItem";
import { notifyOrderStatusChanged } from "@/utils/notifications";

interface OrderTimelineProps {
  statusHistory: StatusUpdate[];
  currentUser: User;
  canEditStatusUpdate?: (update: StatusUpdate) => boolean;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ 
  statusHistory, 
  currentUser,
  canEditStatusUpdate
}) => {
  // Sort updates by timestamp in descending order
  const sortedUpdates = statusHistory ? [...statusHistory].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ) : [];

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
            <TimelineItem 
              key={update.id} 
              update={update}
              index={index}
              totalItems={sortedUpdates.length}
              currentUser={currentUser}
            />
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
