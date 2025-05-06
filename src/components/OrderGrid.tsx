
import React from "react";
import { Order } from "@/types";
import OrderCard from "@/components/OrderCard";
import { FileText } from "lucide-react";

interface OrderGridProps {
  orders: Order[];
}

const OrderGrid: React.FC<OrderGridProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="p-8 text-center rounded-lg border border-dashed bg-muted/50">
        <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <h3 className="text-lg font-medium">No orders found</h3>
        <p className="text-muted-foreground">
          There are no orders matching the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderGrid;
