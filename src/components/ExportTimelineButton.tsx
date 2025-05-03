
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { StatusUpdate } from "@/types";
import { format } from "date-fns";
import { toast } from "sonner";

interface ExportTimelineButtonProps {
  orderNumber: string;
  orderClientName: string;
  statusHistory: StatusUpdate[];
}

const ExportTimelineButton: React.FC<ExportTimelineButtonProps> = ({ 
  orderNumber, 
  orderClientName, 
  statusHistory 
}) => {
  const handleExport = () => {
    // Create a formatted timeline for export
    const timelineText = formatTimelineForExport();
    
    // Create and download a blob
    const blob = new Blob([timelineText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${orderNumber}-timeline.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Timeline for Order ${orderNumber} exported successfully`);
  };
  
  const formatTimelineForExport = () => {
    let text = `ORDER TIMELINE: ${orderNumber}\n`;
    text += `Client: ${orderClientName}\n`;
    text += `Export Date: ${format(new Date(), 'MMM dd, yyyy h:mm a')}\n\n`;
    text += `=======================================================\n\n`;
    
    // Sort updates by timestamp in ascending order (oldest first)
    const sortedUpdates = [...statusHistory].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    sortedUpdates.forEach((update, index) => {
      const date = format(new Date(update.timestamp), 'MMM dd, yyyy h:mm a');
      
      text += `#${index + 1}: ${date}\n`;
      text += `Department: ${update.department}\n`;
      text += `Status: ${update.status}\n`;
      text += `Updated By: ${update.updatedBy}\n`;
      
      if (update.remarks) {
        text += `Remarks: ${update.remarks}\n`;
      }
      
      if (update.estimatedTime) {
        text += `Estimated Time: ${update.estimatedTime}\n`;
      }
      
      text += `\n`;
    });
    
    return text;
  };
  
  return (
    <Button
      variant="outline"
      className="flex items-center"
      onClick={handleExport}
    >
      <Download className="h-4 w-4 mr-2" />
      Export Timeline
    </Button>
  );
};

export default ExportTimelineButton;
