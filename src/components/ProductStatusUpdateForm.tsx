import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Department, Order, ProductStatus, StatusType } from "@/types";
import { Clock, CheckCircle, AlertCircle, Save, Calendar } from "lucide-react";
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
  
  // Enhanced Form state
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(
    order.productStatus?.length ? order.productStatus[0].id : undefined
  );
  const [status, setStatus] = useState<StatusType>("processing");
  const [remarks, setRemarks] = useState("");
  const [estimatedDate, setEstimatedDate] = useState<Date | undefined>(addDays(new Date(), 2));
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Filter products for current department only
  const departmentProducts = order.productStatus?.filter(
    product => !product.assignedDepartment || product.assignedDepartment === department
  );
  
  // Product details for the selected product
  const selectedProductDetails = order.productStatus?.find(p => p.id === selectedProduct);
  
  const handleSubmit = () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    setIsUpdating(true);
    
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
    setIsUpdating(false);
    
    // Call onUpdate callback if provided
    if (onUpdate) {
      onUpdate();
    }
  };
  
  const getStatusColor = (statusType: StatusType) => {
    switch(statusType) {
      case "processing": return "text-amber-500";
      case "completed": return "text-green-500";
      case "issue": return "text-red-500";
      default: return "";
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
      <CardHeader className="border-b border-border/30 pb-3">
        <CardTitle className="flex items-center">
          Update Product Status
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
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
                    {product.status && (
                      <span className={`ml-2 text-xs ${getStatusColor(product.status)}`}>
                        ({product.status})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedProductDetails && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <h4 className="font-medium mb-1">Current Status</h4>
              <div className="flex gap-2">
                <div className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(selectedProductDetails.status)}`}>
                  {selectedProductDetails.status}
                </div>
                {selectedProductDetails.remarks && (
                  <p className="text-muted-foreground">{selectedProductDetails.remarks}</p>
                )}
              </div>
            </div>
          )}
          
          <div>
            <Label className="mb-2 block">Update Status</Label>
            <RadioGroup 
              value={status} 
              onValueChange={(value) => setStatus(value as StatusType)}
              className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
            >
              <div className="flex items-center space-x-2 border border-border rounded-md px-3 py-2">
                <RadioGroupItem value="processing" id="status-processing" />
                <Label htmlFor="status-processing" className="text-amber-500 flex items-center cursor-pointer">
                  <Clock className="h-4 w-4 mr-1" />
                  Processing
                </Label>
              </div>
              <div className="flex items-center space-x-2 border border-border rounded-md px-3 py-2">
                <RadioGroupItem value="completed" id="status-completed" />
                <Label htmlFor="status-completed" className="text-green-500 flex items-center cursor-pointer">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completed
                </Label>
              </div>
              <div className="flex items-center space-x-2 border border-border rounded-md px-3 py-2">
                <RadioGroupItem value="issue" id="status-issue" />
                <Label htmlFor="status-issue" className="text-red-500 flex items-center cursor-pointer">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Issue
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="estimatedDate" className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Estimated Completion Date
            </Label>
            <DatePicker date={estimatedDate} setDate={setEstimatedDate} label="Estimated Completion Date" required={false} />
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
            disabled={isUpdating}
          >
            <Save className="h-4 w-4 mr-2" />
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductStatusUpdateForm;
