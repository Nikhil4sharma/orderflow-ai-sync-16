
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CreditCard, IndianRupee, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DatePickerWithPopover from "@/components/DatePickerWithPopover";
import { useOrders } from "@/contexts/OrderContext";
import { Order } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EnhancedPaymentFormProps {
  order: Order;
  onPaymentRecorded?: () => void;
}

const EnhancedPaymentForm: React.FC<EnhancedPaymentFormProps> = ({ order, onPaymentRecorded }) => {
  const { updateOrder, addStatusUpdate } = useOrders();
  const [amount, setAmount] = useState(order.pendingAmount || 0);
  const [paymentType, setPaymentType] = useState<"full" | "partial">(order.pendingAmount === order.amount ? "full" : "partial");
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date());
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [remarks, setRemarks] = useState("");
  
  // Handle payment type change
  const handlePaymentTypeChange = (value: "full" | "partial") => {
    setPaymentType(value);
    if (value === "full") {
      setAmount(order.pendingAmount || 0);
    } else {
      setAmount(0);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }
    
    if (!paymentDate) {
      toast.error("Please select a payment date");
      return;
    }
    
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    
    // Add the payment to the order
    const newPayment = {
      id: Math.random().toString(36).substring(2, 9),
      amount,
      date: paymentDate.toISOString(),
      method: paymentMethod,
      remarks
    };
    
    // Calculate new payment values
    const newPaidAmount = (order.paidAmount || 0) + amount;
    const newPendingAmount = Math.max(0, order.amount - newPaidAmount);
    
    // Determine new payment status
    let paymentStatus = "Not Paid";
    if (newPaidAmount >= order.amount) {
      paymentStatus = "Paid";
    } else if (newPaidAmount > 0) {
      paymentStatus = "Partial";
    }
    
    // Update order
    const updatedOrder = {
      ...order,
      paidAmount: newPaidAmount,
      pendingAmount: newPendingAmount,
      paymentStatus,
      paymentHistory: [...(order.paymentHistory || []), newPayment]
    };
    
    updateOrder(updatedOrder);
    
    // Add status update
    addStatusUpdate(order.id, {
      department: "Sales",
      status: `Payment Recorded: ${paymentStatus}`,
      remarks: `Payment of ${amount.toLocaleString('en-IN')} received via ${paymentMethod}. ${remarks}`
    });
    
    toast.success("Payment recorded successfully");
    
    // Reset form
    setAmount(newPendingAmount);
    setRemarks("");
    setPaymentType(newPendingAmount === 0 ? "full" : "partial");
    
    // Call callback if provided
    if (onPaymentRecorded) {
      onPaymentRecorded();
    }
  };
  
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-primary" /> 
          Record Payment
        </CardTitle>
        <CardDescription>
          Record a new payment for this order
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Type</Label>
            <RadioGroup 
              value={paymentType}
              onValueChange={(v) => handlePaymentTypeChange(v as "full" | "partial")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full" className="flex justify-between items-center w-full cursor-pointer">
                  <span>Full Payment</span>
                  <span className="text-sm font-medium">{order.pendingAmount?.toLocaleString('en-IN') || 0}</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="partial" id="partial" />
                <Label htmlFor="partial" className="cursor-pointer">Partial Payment</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <div className="relative">
              <IndianRupee className="absolute top-1/2 transform -translate-y-1/2 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                className="pl-10"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            {paymentType === "partial" && amount > (order.pendingAmount || 0) && (
              <p className="text-xs text-red-500 flex items-center">
                <span>Amount exceeds the pending balance</span>
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date</Label>
              <DatePickerWithPopover
                date={paymentDate}
                onDateChange={setPaymentDate}
                placeholder="Select date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              placeholder="Enter any additional payment details"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full">
            <CreditCard className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EnhancedPaymentForm;
