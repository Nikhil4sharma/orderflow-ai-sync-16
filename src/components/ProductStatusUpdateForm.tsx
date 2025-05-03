
import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Department, Order, ProductStatus, StatusType } from "@/types";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { format, addDays } from "date-fns";

interface ProductStatusUpdateFormProps {
  order: Order;
  department: Department;
  onUpdate?: () => void;
}

const ProductStatusUpdateForm: React.FC<ProductStatusUpdateFormProps> = ({ 
  order, 
  department,
  onUpdate 
}) => {
  const { updateOrder, addStatusUpdate, currentUser } = useOrders();
  
  // Form state
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(
    order.productStatus?.length ? order.productStatus[0].id : undefined
  );
  const [status, setStatus] = useState<StatusType>("processing");
  const [remarks, setRemarks] = useState("");
  const [estimatedDate, setEstimatedDate] = useState<Date | undefined>(addDays(new Date(), 2));
  
  // Filter products for current department only
  const departmentProducts = order.productStatus?.filter(
    product => !product.assignedDepartment || product.assignedDepartment === department
  );
  
  const handleSubmit = () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }
    
    // Update the product status
    const updatedProductStatus = order.productStatus?.map(product => 
      product.id === selectedProduct 
        ? { 
            ...product, 
            status,
            remarks: remarks || product.remarks,
            estimatedCompletion: estimatedDate ? format(estimatedDate, 'yyyy-MM-dd') : undefined,
            assignedDepartment: department
          }
        : product
    ) || [];
    
    // Update the order
    const updatedOrder = {
      ...order,
      productStatus: updatedProductStatus
    };
    
    updateOrder(updatedOrder);
    
    // Add status update to timeline
    addStatusUpdate(order.id, {
      orderId: order.id,
      department: department,
      status: `Product Status: ${status}`,
      remarks: remarks,
      updatedBy: currentUser?.name || "Unknown",
      estimatedTime: estimatedDate ? format(estimatedDate, 'MMM dd, yyyy') : undefined,
      selectedProduct: selectedProduct
    });
    
    toast.success(`Updated status for ${order.productStatus?.find(p => p.id === selectedProduct)?.name}`);
    
    // Reset form
    setRemarks("");
    
    // Call onUpdate callback if provided
    if (onUpdate) {
      onUpdate();
    }
  };
  
  if (!departmentProducts || departmentProducts.length === 0) {
    return (
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            Update Product Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            No products available for {department} department.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="glass-card mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          Update Product Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <Label htmlFor="product">Select Product</Label>
            <Select
              value={selectedProduct}
              onValueChange={setSelectedProduct}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {departmentProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="mb-2 block">Status</Label>
            <RadioGroup 
              value={status} 
              onValueChange={(value) => setStatus(value as StatusType)}
              className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="processing" id="status-processing" />
                <Label htmlFor="status-processing" className="text-amber-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Processing
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="status-completed" />
                <Label htmlFor="status-completed" className="text-green-500 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completed
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="issue" id="status-issue" />
                <Label htmlFor="status-issue" className="text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Issue
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="estimatedDate">Estimated Completion Date</Label>
            <DatePicker
              date={estimatedDate}
              setDate={setEstimatedDate}
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Add any notes about the product status"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            type="button"
          >
            Update Status
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductStatusUpdateForm;
