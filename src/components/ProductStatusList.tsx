
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductStatus, StatusType } from "@/types";
import { CheckCircle, AlertCircle, Clock, Tag, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/contexts/OrderContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";

interface ProductStatusListProps {
  orderId: string;
  products: ProductStatus[];
  canEdit?: boolean;
}

const ProductStatusList: React.FC<ProductStatusListProps> = ({ orderId, products, canEdit = false }) => {
  const { updateOrder, orders } = useOrders();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(products[0]?.id || null);
  const [newStatus, setNewStatus] = useState<StatusType>("processing");
  const [remarks, setRemarks] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [estimatedDate, setEstimatedDate] = useState<Date | undefined>(undefined);
  
  const order = orders.find(o => o.id === orderId);
  
  // Helper function to render status icon
  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "processing":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "issue":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  // Helper function to get status text class
  const getStatusClass = (status: StatusType) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "processing":
        return "text-amber-500";
      case "issue":
        return "text-red-500";
      default:
        return "";
    }
  };

  const handleUpdateProductStatus = () => {
    if (!selectedProduct || !order) {
      toast.error("Please select a product");
      return;
    }

    setIsUpdating(true);

    // Update the product status in the order
    const updatedProductStatus = order.productStatus?.map(product => 
      product.id === selectedProduct 
        ? { 
            ...product, 
            status: newStatus, 
            remarks: remarks || product.remarks,
            estimatedCompletion: estimatedDate ? format(estimatedDate, 'yyyy-MM-dd') : undefined
          }
        : product
    ) || [];

    const updatedOrder = {
      ...order,
      productStatus: updatedProductStatus
    };

    updateOrder(updatedOrder);
    toast.success(`Updated status for ${order.productStatus?.find(p => p.id === selectedProduct)?.name}`);
    setRemarks("");
    setEstimatedDate(undefined);
    setIsUpdating(false);
  };

  // If no products, show a placeholder
  if (!products || products.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center text-muted-foreground">
          No product status information available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center">
          <Tag className="h-5 w-5 mr-2" /> 
          Product Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {canEdit && (
          <div className="mb-6 border-b pb-6">
            <h4 className="font-medium mb-3">Update Product Status</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-select">Select Product</Label>
                <Select
                  value={selectedProduct || ''}
                  onValueChange={(value) => setSelectedProduct(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
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
                  value={newStatus} 
                  onValueChange={(value) => setNewStatus(value as StatusType)}
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
                <Label htmlFor="remarks">Remarks (optional)</Label>
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
                onClick={handleUpdateProductStatus}
                disabled={!selectedProduct || isUpdating}
              >
                Update Product Status
              </Button>
            </div>
          </div>
        )}
        
        <div className="divide-y divide-border/30">
          {products.map((product) => (
            <div 
              key={product.id} 
              className={`py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${selectedProduct === product.id ? 'bg-accent/10 -mx-4 px-4 rounded-md' : ''}`}
              onClick={() => canEdit && setSelectedProduct(product.id)}
            >
              <div>
                <h3 className="font-medium">{product.name}</h3>
                {product.estimatedCompletion && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    <CalendarClock className="h-3 w-3 mr-1" /> 
                    Estimated completion: {product.estimatedCompletion}
                  </p>
                )}
                {product.remarks && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.remarks}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className={`${getStatusClass(product.status)} font-medium`}>
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </span>
                {getStatusIcon(product.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductStatusList;
