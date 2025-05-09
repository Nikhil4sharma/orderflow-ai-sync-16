import React, { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Order, OrderStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { getAllowedStatusesForDepartment } from '@/lib/mock-data';
import { ClipboardCheck } from 'lucide-react';
import TimeEstimationInput from './TimeEstimationInput';
import { DatePicker } from "@/components/ui/date-picker";

interface DepartmentStatusUpdateFormProps {
  order: Order;
}

const DepartmentStatusUpdateForm: React.FC<DepartmentStatusUpdateFormProps> = ({ order }) => {
  const { currentUser, updateOrder, addStatusUpdate } = useOrders();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [remarks, setRemarks] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  
  // Get allowed statuses for current department
  const allowedStatuses = getAllowedStatusesForDepartment(currentUser?.department || 'Sales');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate mandatory timeline
    if (!estimatedTime) {
      toast.error("Please provide an estimated time for completion");
      return;
    }
    
    // Update order with new status
    const updatedOrder = {
      ...order,
      status,
    };
    
    // Update order
    updateOrder(updatedOrder);
    
    // Add status update with estimated time
    addStatusUpdate(order.id, {
      status,
      remarks,
      estimatedTime,
    });
    
    toast.success(`Order status updated to ${status}`);
    
    // Reset form
    setRemarks('');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ClipboardCheck className="h-5 w-5 mr-2" />
          Update Status for {currentUser?.department}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Status</label>
            <Select
              value={status}
              onValueChange={(value: OrderStatus) => setStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {allowedStatuses.map(statusOption => (
                  <SelectItem key={statusOption} value={statusOption}>
                    {statusOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <DatePicker date={estimatedTime ? new Date(estimatedTime) : undefined} setDate={d => setEstimatedTime(d ? d.toISOString() : '')} label="Estimated Completion Date" required={true} />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Remarks</label>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter any additional details or comments"
              rows={3}
            />
          </div>
          
          <Button type="submit" className="w-full">
            Update Status
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DepartmentStatusUpdateForm;
