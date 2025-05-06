
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status?: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  if (!status) return null;

  const getStatusStyle = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes("completed")) {
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/30";
    }
    
    if (statusLower.includes("in progress") || statusLower.includes("working")) {
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/30";
    }
    
    if (statusLower.includes("pending") || statusLower.includes("waiting")) {
      return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/30";
    }
    
    if (statusLower.includes("issue") || statusLower.includes("rejected")) {
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/30";
    }
    
    if (statusLower.includes("ready") || statusLower.includes("approved")) {
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/30";
    }
    
    if (statusLower.includes("new")) {
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700/50";
    }
    
    return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700/50";
  };
  
  return (
    <Badge 
      variant="outline" 
      className={cn("font-normal", getStatusStyle(status), className)}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
