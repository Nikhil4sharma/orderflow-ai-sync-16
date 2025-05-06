
import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CreditCard, CheckCircle2, Ban } from "lucide-react";
import { Order } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { canVerifyPayment } from "@/lib/permissions";

interface PaymentVerificationFormProps {
  order: Order;
}

const PaymentVerificationForm: React.FC<PaymentVerificationFormProps> = ({ order }) => {
  const { updateOrder, addStatusUpdate, addPayment, currentUser } = useOrders();
  
  const [verifyType, setVerifyType] = useState<"full" | "partial">("full");
  const [amount, setAmount] = useState<number>(order.pendingAmount);
  const [method, setMethod] = useState<string>("Bank Transfer");
  const [remarks, setRemarks] = useState<string>("");
  
  // Only show if the order is not fully paid and user has permission
  if (order.paymentStatus === "Paid" || !canVerifyPayment(currentUser)) {
    return null;
  }
  
  const handleVerifyPayment = () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }
    
    // Add the payment to the order
    addPayment(order.id, {
      amount,
      date: new Date().toISOString(),
      method,
      remarks
    });
    
    // If verifying full payment, update order status if needed
    if (verifyType === "full" || amount >= order.pendingAmount) {
      // Add status update to timeline
      addStatusUpdate(order.id, {
        department: "Sales",
        status: "Payment Verified",
        remarks: `Full payment of ${amount.toLocaleString()} verified via ${method}. ${remarks}`
      });
      
      toast.success("Full payment has been verified");
    } else {
      // Add status update for partial payment
      addStatusUpdate(order.id, {
        department: "Sales",
        status: "Partial Payment Received",
        remarks: `Payment of ${amount.toLocaleString()} received via ${method}. ${remarks}`
      });
      
      toast.success("Partial payment has been recorded");
    }
    
    // Reset form
    setAmount(0);
    setRemarks("");
  };
  
  return (
    <Card className="glass-card mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Verify Order Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted rounded-md p-3">
            <p className="text-sm font-medium">Total Amount</p>
            <p className="text-lg font-bold">₹{order.amount.toLocaleString()}</p>
          </div>
          <div className="bg-muted rounded-md p-3">
            <p className="text-sm font-medium">Pending Amount</p>
            <p className="text-lg font-bold text-amber-600">₹{order.pendingAmount.toLocaleString()}</p>
          </div>
        </div>
        
        <form className="space-y-4">
          <div>
            <Label className="mb-2 block">Payment Type</Label>
            <RadioGroup 
              value={verifyType} 
              onValueChange={(value) => {
                setVerifyType(value as "full" | "partial");
                if (value === "full") {
                  setAmount(order.pendingAmount);
                } else {
                  setAmount(0);
                }
              }}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="full-payment" />
                <Label htmlFor="full-payment" className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  Full Payment (₹{order.pendingAmount.toLocaleString()})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partial" id="partial-payment" />
                <Label htmlFor="partial-payment" className="flex items-center">
                  <Ban className="h-4 w-4 mr-2 text-amber-500" />
                  Partial Payment
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="amount">Amount Received</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              placeholder="Enter payment amount"
            />
          </div>
          
          <div>
            <Label htmlFor="method">Payment Method</Label>
            <Input
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              placeholder="e.g., Bank Transfer, Cash, Check"
            />
          </div>
          
          <div>
            <Label htmlFor="payment-remarks">Additional Notes</Label>
            <Textarea
              id="payment-remarks"
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any notes about this payment..."
            />
          </div>
          
          <Button 
            type="button"
            onClick={handleVerifyPayment}
            className="w-full"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Verify {verifyType === "full" ? "Full" : "Partial"} Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentVerificationForm;
