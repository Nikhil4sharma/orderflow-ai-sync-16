
import React from "react";
import { cn } from "@/lib/utils";
import { getStatusColorClass } from "@/lib/mock-data";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  return (
    <span className={cn(getStatusColorClass(status), className)}>
      {status}
    </span>
  );
};

export default StatusBadge;
