
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { Order } from "@/types";

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const { addOrder, currentUser } = useOrders();
  
  // Form state
  const [orderNumber, setOrderNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState("");
  const [items, setItems] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!orderNumber || !clientName || !amount || !items) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    
    // Create new order
    const newOrder: Order = {
      id: uuidv4(),
      orderNumber: orderNumber.trim(),
      clientName: clientName.trim(),
      amount: parsedAmount,
      paidAmount: 0,
      pendingAmount: parsedAmount,
      paymentStatus: "Not Paid",
      items: items.split(",").map(item => item.trim()),
      createdAt: new Date().toISOString(),
      status: "New",
      currentDepartment: "Sales",
      statusHistory: [
        {
          id: uuidv4(),
          orderId: uuidv4(),
          department: "Sales",
          status: "New",
          remarks: "Order created",
          timestamp: new Date().toISOString(),
          updatedBy: currentUser.name,
        },
      ],
      paymentHistory: [],
      productStatus: items.split(",").map((item, index) => ({
        id: `prod-${index}-${uuidv4()}`,
        name: item.trim(),
        status: "processing" as const,
      }))
    };
    
    // Add the new order
    addOrder(newOrder);
    
    // Show success message
    toast.success("New order created successfully");
    
    // Navigate to the order detail page
    navigate(`/orders/${newOrder.id}`);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Button>
      
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="order-number">Order Number*</Label>
                  <Input
                    id="order-number"
                    placeholder="e.g., ORD-2023-006"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name*</Label>
                  <Input
                    id="client-name"
                    placeholder="e.g., Acme Corp"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Order Amount (₹)*</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 1500.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="items">
                  Order Items* (comma separated)
                </Label>
                <Input
                  id="items"
                  placeholder="e.g., Business Cards, Letterheads, Brochures"
                  value={items}
                  onChange={(e) => setItems(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter multiple items separated by commas
                </p>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Order</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewOrder;
