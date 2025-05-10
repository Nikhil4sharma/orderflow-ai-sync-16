import React, { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Order, OrderStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CheckCircle, X } from 'lucide-react';
import TimeEstimationInput from './TimeEstimationInput';

interface ApprovalFormProps {
  order: Order;
  onApproved?: () => void;
  onRejected?: () => void;
}

const ApprovalForm: React.FC<ApprovalFormProps> = ({ 
  order, 
  onApproved,
  onRejected 
}) => {
  const { updateOrder, addStatusUpdate } = useOrders();
  const [feedback, setFeedback] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  // Determine which department made the approval request
  const getRequestingDepartment = () => {
    if (order.designStatus === 'Pending Feedback from Sales Team') {
      return 'Design';
    } else if (order.prepressStatus === 'Waiting for approval') {
      return 'Prepress';
    }
    return null;
  };
  
  const requestingDepartment = getRequestingDepartment();
  
  // Handle approval action
  const handleApprove = () => {
    if (!requestingDepartment) return;
    
    if (!estimatedTime) {
      toast.error('Please provide an estimated time for completion');
      return;
    }
    
    const updatedOrder = { ...order };
    
    if (requestingDepartment === 'Design') {
      // Design approval
      addStatusUpdate(order.id, {
        department: 'Sales',
        status: 'Design Approved' as OrderStatus,
        remarks: feedback,
        estimatedTime
      });
      
      // Update design status to allow them to proceed
      updatedOrder.designStatus = 'Working on it';
      
    } else if (requestingDepartment === 'Prepress') {
      // Prepress approval
      addStatusUpdate(order.id, {
        department: 'Sales',
        status: 'Prepress Approved' as OrderStatus,
        remarks: feedback,
        estimatedTime
      });
      
      // Update prepress status to allow them to proceed
      updatedOrder.prepressStatus = 'Working on it';
    }
    
    updateOrder(updatedOrder);
    toast.success(`${requestingDepartment} work approved`);
    
    if (onApproved) onApproved();
  };
  
  // Handle rejection action
  const handleReject = () => {
    if (!requestingDepartment) return;
    
    if (!feedback) {
      toast.error('Please provide feedback for rejection');
      return;
    }
    
    const updatedOrder = { ...order };
    
    if (requestingDepartment === 'Design') {
      // Design rejection
      addStatusUpdate(order.id, {
        department: 'Sales',
        status: 'Design Rejected' as OrderStatus,
        remarks: feedback
      });
      
      // Update design status to indicate rejection
      updatedOrder.designStatus = 'Working on it';
      
    } else if (requestingDepartment === 'Prepress') {
      // Prepress rejection
      addStatusUpdate(order.id, {
        department: 'Sales',
        status: 'Prepress Rejected' as OrderStatus,
        remarks: feedback
      });
      
      // Update prepress status to indicate rejection
      updatedOrder.prepressStatus = 'Working on it';
    }
    
    updateOrder(updatedOrder);
    toast.success(`Feedback sent to ${requestingDepartment} team`);
    
    if (onRejected) onRejected();
  };
  
  // If there's no pending approval request, don't render the form
  if (!requestingDepartment) {
    return null;
  }
  
  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-500/20 mb-6">
      <CardHeader className="bg-amber-100 dark:bg-amber-800/30 border-b border-amber-200 dark:border-amber-700/30">
        <CardTitle className="text-amber-800 dark:text-amber-300 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Approval Required from {requestingDepartment} Department
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="text-sm">
          <p className="mb-4">
            <strong>{requestingDepartment}</strong> team is waiting for your approval to proceed.
            {requestingDepartment === 'Design' && ' The design work has been completed.'}
            {requestingDepartment === 'Prepress' && ' The prepress work has been completed.'}
          </p>
        </div>
        
        <TimeEstimationInput 
          value={estimatedTime} 
          onChange={setEstimatedTime}
          required={true}
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Feedback</label>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={`Provide feedback for the ${requestingDepartment} team...`}
            rows={3}
          />
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button
            variant="default"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleApprove}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleReject}
          >
            <X className="h-4 w-4 mr-2" />
            Request Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovalForm;
