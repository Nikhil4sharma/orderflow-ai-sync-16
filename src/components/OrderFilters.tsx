
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getDepartments } from "@/lib/mock-data";
import { Department } from "@/types";

interface OrderFiltersProps {
  departmentFilter: Department | 'All';
  statusFilter: string | 'All';
  onDepartmentChange: (value: Department | 'All') => void;
  onStatusChange: (value: string | 'All') => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  departmentFilter,
  statusFilter,
  onDepartmentChange,
  onStatusChange,
}) => {
  const departments = ['All', ...getDepartments()];
  const statuses = ['All', 'New', 'In Progress', 'Completed', 'On Hold', 'Issue'];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="w-full sm:w-1/2">
        <Label htmlFor="department-filter" className="mb-2 block">Department</Label>
        <Select
          value={departmentFilter}
          onValueChange={(value) => onDepartmentChange(value as Department | 'All')}
        >
          <SelectTrigger id="department-filter" className="w-full">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-1/2">
        <Label htmlFor="status-filter" className="mb-2 block">Status</Label>
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusChange(value as string | 'All')}
        >
          <SelectTrigger id="status-filter" className="w-full">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OrderFilters;
