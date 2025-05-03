import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { Order, PaymentStatus } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const { addOrder, currentUser } = useOrders();
  
  // Form state
  const [orderNumber, setOrderNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState("");
  const [items, setItems] = useState("");
  const [paidAmount, setPaidAmount] = useState("0");
  const [remarks, setRemarks] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentRemarks, setPaymentRemarks] = useState("");
  const [targetDepartment, setTargetDepartment] = useState<string>("Design");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!orderNumber || !clientName || !amount || !items) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    const parsedPaidAmount = parseFloat(paidAmount) || 0;
    const pendingAmount = Math.max(0, parsedAmount - parsedPaidAmount);
    
    // Determine payment status
    let paymentStatus: PaymentStatus = "Not Paid";
    if (parsedPaidAmount >= parsedAmount) {
      paymentStatus = "Paid";
    } else if (parsedPaidAmount > 0) {
      paymentStatus = "Partially Paid";
    }
    
    // Create payment record if payment was made
    const paymentHistory = [];
    if (parsedPaidAmount > 0) {
      paymentHistory.push({
        id: uuidv4(),
        amount: parsedPaidAmount,
        date: new Date().toISOString(),
        method: paymentMethod || 'Not specified',
        remarks: paymentRemarks
      });
    }
    
    // Create product status entries for each item
    const productStatus = items.split(",").map((item, index) => ({
      id: `prod-${index}-${uuidv4()}`,
      name: item.trim(),
      status: "processing" as const,
    }));
    
    // Create new order
    const newOrder: Order = {
      id: uuidv4(),
      orderNumber: orderNumber.trim(),
      clientName: clientName.trim(),
      amount: parsedAmount,
      paidAmount: parsedPaidAmount,
      pendingAmount,
      paymentStatus,
      items: items.split(",").map(item => item.trim()),
      createdAt: new Date().toISOString(),
      status: "New",
      currentDepartment: targetDepartment as any,
      statusHistory: [
        {
          id: uuidv4(),
          orderId: uuidv4(),
          department: "Sales",
          status: "New",
          remarks: remarks || "Order created",
          timestamp: new Date().toISOString(),
          updatedBy: currentUser.name,
        },
      ],
      paymentHistory,
      productStatus,
      lastPaymentDate: parsedPaidAmount > 0 ? new Date().toISOString() : undefined
    };
    
    // Add the new order
    addOrder(newOrder);
    
    // Show success message
    toast.success("New order created successfully");
    
    // Navigate to the order detail page
    navigate(`/orders/${newOrder.id}`);
  };
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { Order, PaymentStatus } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const { addOrder, currentUser } = useOrders();
  
  // Form state
  const [orderNumber, setOrderNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState("");
  const [items, setItems] = useState("");
  const [paidAmount, setPaidAmount] = useState("0");
  const [remarks, setRemarks] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentRemarks, setPaymentRemarks] = useState("");
  const [targetDepartment, setTargetDepartment] = useState<string>("Design");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!orderNumber || !clientName || !amount || !items) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    const parsedPaidAmount = parseFloat(paidAmount) || 0;
    const pendingAmount = Math.max(0, parsedAmount - parsedPaidAmount);
    
    // Determine payment status
    let paymentStatus: PaymentStatus = "Not Paid";
    if (parsedPaidAmount >= parsedAmount) {
      paymentStatus = "Paid";
    } else if (parsedPaidAmount > 0) {
      paymentStatus = "Partially Paid";
    }
    
    // Create payment record if payment was made
    const paymentHistory = [];
    if (parsedPaidAmount > 0) {
      paymentHistory.push({
        id: uuidv4(),
        amount: parsedPaidAmount,
        date: new Date().toISOString(),
        method: paymentMethod || 'Not specified',
        remarks: paymentRemarks
      });
    }
    
    // Create product status entries for each item
    const productStatus = items.split(",").map((item, index) => ({
      id: `prod-${index}-${uuidv4()}`,
      name: item.trim(),
      status: "processing" as const,
    }));
    
    // Create new order
    const newOrder: Order = {
      id: uuidv4(),
      orderNumber: orderNumber.trim(),
      clientName: clientName.trim(),
      amount: parsedAmount,
      paidAmount: parsedPaidAmount,
      pendingAmount,
      paymentStatus,
      items: items.split(",").map(item => item.trim()),
      createdAt: new Date().toISOString(),
      status: "New",
      currentDepartment: targetDepartment as any,
      statusHistory: [
        {
          id: uuidv4(),
          orderId: uuidv4(),
          department: "Sales",
          status: "New",
          remarks: remarks || "Order created",
          timestamp: new Date().toISOString(),
          updatedBy: currentUser.name,
        },
      ],
      paymentHistory,
      productStatus,
      lastPaymentDate: parsedPaidAmount > 0 ? new Date().toISOString() : undefined
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Label htmlFor="paid-amount">Paid Amount (₹)</Label>
                  <Input
                    id="paid-amount"
                    type="number"
                    placeholder="e.g., 500.00"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                  />
                </div>
              </div>
              
              {paidAmount && parseFloat(paidAmount) > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method*</Label>
                    <Select 
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      required={parseFloat(paidAmount) > 0}
                    >
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payment-remarks">Payment Remarks</Label>
                    <Input
                      id="payment-remarks"
                      placeholder="e.g., Transaction ID, Cheque number"
                      value={paymentRemarks}
                      onChange={(e) => setPaymentRemarks(e.target.value)}
                    />
                  </div>
                </div>
              )}
              
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
              
              <div className="space-y-2">
                <Label htmlFor="target-department">Forward To Department</Label>
                <Select 
                  value={targetDepartment}
                  onValueChange={setTargetDepartment}
                >
                  <SelectTrigger id="target-department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Prepress">Prepress</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  placeholder="Any additional information about this order"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                />
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
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Order
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewOrder;
