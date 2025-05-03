
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductStatus, StatusType } from "@/types";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

interface ProductStatusListProps {
  orderId: string;
  products: ProductStatus[];
}

const ProductStatusList: React.FC<ProductStatusListProps> = ({ orderId, products }) => {
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
      <CardContent className="p-6">
        <div className="divide-y divide-border/30">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="py-4 first:pt-0 last:pb-0 flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium">{product.name}</h3>
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
