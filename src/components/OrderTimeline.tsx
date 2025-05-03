
import React from "react";
import { StatusUpdate } from "@/types";
import StatusBadge from "./StatusBadge";
import { format } from "date-fns";
import { ClipboardCheck } from "lucide-react";

interface OrderTimelineProps {
  statusHistory: StatusUpdate[];
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ statusHistory }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Sort updates by timestamp in descending order
  const sortedUpdates = statusHistory ? [...statusHistory].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ) : [];

  return (
    <div className="space-y-4 mt-4 glass-card p-6 rounded-lg">
      <h3 className="text-lg font-medium">Order Timeline</h3>
      <div className="space-y-6">
        {sortedUpdates.map((update) => (
          <div key={update.id} className="timeline-item">
            <div className="flex items-start mb-1">
              <div className="mr-4 mt-1">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <ClipboardCheck className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">
                    {update.department} - <StatusBadge status={update.status} />
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(update.timestamp)}
                  </span>
                </div>
                {update.remarks && (
                  <p className="text-sm mt-1">{update.remarks}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Updated by {update.updatedBy}
                </p>
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
