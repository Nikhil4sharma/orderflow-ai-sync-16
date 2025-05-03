
import React from "react";
import { StatusUpdate } from "@/types";
import StatusBadge from "./StatusBadge";
import { format } from "date-fns";
import { CheckCircle } from "lucide-react";

interface OrderTimelineProps {
  updates: StatusUpdate[];
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ updates }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Sort updates by timestamp in descending order
  const sortedUpdates = [...updates].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-medium">Order Timeline</h3>
      <div className="space-y-4">
        {sortedUpdates.map((update) => (
          <div key={update.id} className="timeline-item">
            <div className="flex items-start mb-1">
              <div className="mr-4 mt-1">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
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
      </div>
    </div>
  );
};

export default OrderTimeline;
