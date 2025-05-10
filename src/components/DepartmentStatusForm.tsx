
import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Department, DesignStatus, Order, OrderStatus, PrepressStatus } from "@/types";
import { Clock, AlertCircle } from "lucide-react";
import TimeEstimationInput from "./TimeEstimationInput";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DepartmentStatusFormProps {
  order: Order;
  department: Department;
}

const DepartmentStatusForm: React.FC<DepartmentStatusFormProps> = ({ order, department }) => {
  const { updateOrder, addStatusUpdate, currentUser } = useOrders();
  
  // Form state based on department
  const [status, setStatus] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  
  const getStatusOptions = () => {
    switch (department) {
      case 'Design':
        return ['Working on it', 'Pending Feedback from Sales Team', 'Forwarded to Prepress'];
      case 'Prepress':
        return ['Waiting for approval', 'Forwarded to production', 'Working on it'];
      case 'Production':
        return ['In Progress', 'On Hold', 'Completed', 'Issue'];
      default:
        return ['In Progress', 'On Hold', 'Completed', 'Issue'];
    }
  };
  
  // Get color based on selected status
  const getStatusColor = (selectedStatus: string): string => {
    if (selectedStatus.includes('Pending') || selectedStatus.includes('Waiting')) {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    } else if (selectedStatus.includes('Completed') || selectedStatus.includes('Forwarded')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    } else if (selectedStatus.includes('Issue')) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    } else if (selectedStatus.includes('Working')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };
  
  const handleSubmit = () => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }
    
    // Validate timeline
    if (!estimatedTime) {
      toast.error("Please provide an estimated time for completion");
      return;
    }
    
    const updatedOrder = { ...order };
    
    // Update department-specific fields
    switch (department) {
      case 'Design':
        updatedOrder.designStatus = status as DesignStatus;
        updatedOrder.designRemarks = remarks;
        break;
      case 'Prepress':
        updatedOrder.prepressStatus = status as PrepressStatus;
        updatedOrder.prepressRemarks = remarks;
        break;
      case 'Production':
        // For production, we'd typically update a specific stage
        break;
      default:
        // General status update - use proper typing
        updatedOrder.status = status as OrderStatus;
    }
    
    // Update general order status with proper OrderStatus type
    if (['Completed', 'Ready', 'Forwarded to Prepress', 'Forwarded to production'].includes(status)) {
      updatedOrder.status = "Completed" as OrderStatus;
    } else if (['Working on it', 'In Progress', 'Waiting for approval'].includes(status)) {
      updatedOrder.status = "In Progress" as OrderStatus;
    }
    
    updateOrder(updatedOrder);
    
    // Add status update to timeline with edit/undo capabilities
    addStatusUpdate(order.id, {
      orderId: order.id,
      department: department,
      status: status as OrderStatus,
      remarks: remarks,
      estimatedTime: estimatedTime
    });
    
    toast.success("Status updated successfully");
    
    // Reset form
    setRemarks("");
  };
  
  return (
    <Card className="glass-card overflow-hidden border-t-4 border-t-primary">
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center text-lg">
          Update {department} Status
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Update the status of this order for your department
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <form className="space-y-4">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium leading-6"
            >
              Status
            </label>
            <div className="mt-2">
              <Select
                value={status}
                onValueChange={setStatus}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select ${department} status`} />
                </SelectTrigger>
                <SelectContent>
                  {getStatusOptions().map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {status && (
                <div className="mt-2">
                  <Badge className={`${getStatusColor(status)}`}>
                    {status}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <TimeEstimationInput 
              value={estimatedTime}
              onChange={setEstimatedTime}
              required={true}
            />
          </div>
          
          <div>
            <label
              htmlFor="remarks"
              className="block text-sm font-medium leading-6"
            >
              Remarks
            </label>
            <div className="mt-2">
              <Textarea
                id="remarks"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add notes about current status..."
                className="block w-full rounded-md border-0 py-1.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="bg-muted/30 border-t border-border/50 flex flex-col items-start pt-4">
        <Alert variant="default" className="mb-4 text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-900">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-sm font-medium">Important</AlertTitle>
          <AlertDescription className="text-xs">
            Status updates can be undone within 5 minutes and edited within 1 hour.
          </AlertDescription>
        </Alert>
        
        <Button 
          onClick={handleSubmit}
          className="w-full mt-2"
        >
          <Clock className="mr-1 h-4 w-4" />
          Update Status
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DepartmentStatusForm;
