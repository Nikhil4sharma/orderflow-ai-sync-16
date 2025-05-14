
import React, { useState } from 'react';
import { Order, ProductStatus, StatusType, Department } from '@/types';
import { useOrders } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import TimeEstimationInput from './TimeEstimationInput';

interface ProductStatusUpdateFormProps {
  order: Order;
  productId: string;
  onClose?: () => void;
}

const ProductStatusUpdateForm: React.FC<ProductStatusUpdateFormProps> = ({
  order,
  productId,
  onClose
}) => {
  const { updateOrder, addStatusUpdate, currentUser } = useOrders();
  const [status, setStatus] = useState<StatusType>('processing');
  const [remarks, setRemarks] = useState('');
  const [estimatedCompletion, setEstimatedCompletion] = useState('');
  
  // Find the product to update
  const productToUpdate = order.productStatus?.find(p => p.id === productId);
  
  if (!productToUpdate) {
    return <div>Product not found</div>;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create updated product status
    const updatedProductStatus = order.productStatus?.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          status,
          remarks,
          estimatedCompletion,
          assignedDepartment: currentUser?.department
        };
      }
      return product;
    }) || [];
    
    // Update order with new product status
    updateOrder({
      ...order,
      productStatus: updatedProductStatus
    });
    
    // Add status update for the specific product
    addStatusUpdate(order.id, {
      department: currentUser?.department || 'Sales' as Department,
      status: `Product Status: ${status}` as any,
      remarks: `Product: ${productToUpdate.name} - ${remarks}`,
      selectedProduct: productId,
      estimatedTime: estimatedCompletion
    });
    
    toast.success(`Product status updated to ${status}`);
    if (onClose) onClose();
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Update Status for {productToUpdate.name}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Status</label>
          <Select
            value={status}
            onValueChange={(value: StatusType) => setStatus(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="processing">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="issue">Issue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <TimeEstimationInput 
          value={estimatedCompletion}
          onChange={setEstimatedCompletion}
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Remarks</label>
          <Textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter any additional details or comments"
            rows={3}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button type="submit">Update Status</Button>
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductStatusUpdateForm;
