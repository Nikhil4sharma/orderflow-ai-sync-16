
import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CreditCard, CheckCircle2, Ban, AlertTriangle, CreditCardIcon, IndianRupee } from "lucide-react";
import { Order } from "@/types/common";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { canVerifyPayment } from "@/lib/permissions";
import { Progress } from "@/components/ui/progress";
import { formatIndianRupees } from "@/lib/utils";
import { nanoid } from "nanoid";

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
  
  // Calculate payment percentage
  const paymentPercent = Math.min(Math.round((order.paidAmount / order.amount) * 100), 100);
  
  const handleVerifyPayment = () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }
    
    // Add the payment to the order with an ID
    addPayment(order.id, {
      id: nanoid(),
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
        remarks: `Full payment of ${formatIndianRupees(amount)} verified via ${method}. ${remarks}`
      });
      
      toast.success("Full payment has been verified");
    } else {
      // Add status update for partial payment
      addStatusUpdate(order.id, {
        department: "Sales",
        status: "Partial Payment Received",
        remarks: `Payment of ${formatIndianRupees(amount)} received via ${method}. ${remarks}`
      });
      
      toast.success("Partial payment has been recorded");
    }
    
    // Reset form
    setAmount(0);
    setRemarks("");
  };
  
  return (
    <Card className="glass-card mb-6 overflow-hidden">
      <div className={`w-full h-1 ${paymentPercent < 100 ? "bg-amber-500" : "bg-green-500"}`}></div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Payment Verification</CardTitle>
          </div>
          <div className="bg-muted px-2 py-1 rounded-md text-xs font-medium">
            {order.paymentStatus === "Not Paid" ? "No Payment" : 
             order.paymentStatus === "Partial" ? "Partially Paid" : "Fully Paid"}
          </div>
        </div>
        <CardDescription>Verify and record payments for this order</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Payment Progress</span>
            <span className="font-medium">{paymentPercent}%</span>
          </div>
          <Progress value={paymentPercent} className="h-2" />
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-muted/50 rounded-md p-4 flex flex-col">
              <span className="text-xs text-muted-foreground">Total Amount</span>
              <div className="flex items-center mt-1">
                <IndianRupee className="h-3 w-3 mr-1 text-muted-foreground" />
                <span className="text-lg font-semibold">{formatIndianRupees(order.amount)}</span>
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-md p-4 flex flex-col">
              <span className="text-xs text-muted-foreground">Pending Amount</span>
              <div className="flex items-center mt-1">
                <IndianRupee className="h-3 w-3 mr-1 text-amber-500" />
                <span className="text-lg font-semibold text-amber-500">{formatIndianRupees(order.pendingAmount)}</span>
              </div>
            </div>
          </div>
          
          {order.paymentHistory && order.paymentHistory.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Payment History</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {order.paymentHistory.map((payment, index) => (
                  <div key={payment.id || index} className="text-xs bg-muted/30 p-2 rounded-md flex justify-between">
                    <span>{new Date(payment.date).toLocaleDateString()}: {payment.method}</span>
                    <span className="font-medium">{formatIndianRupees(payment.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              <div className="flex items-center space-x-2 bg-muted/30 p-2 rounded-md">
                <RadioGroupItem value="full" id="full-payment" />
                <Label htmlFor="full-payment" className="flex items-center w-full justify-between">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    <span>Full Payment</span>
                  </div>
                  <span className="text-xs font-medium">{formatIndianRupees(order.pendingAmount)}</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-muted/30 p-2 rounded-md">
                <RadioGroupItem value="partial" id="partial-payment" />
                <Label htmlFor="partial-payment" className="flex items-center">
                  <Ban className="h-4 w-4 mr-2 text-amber-500" />
                  Partial Payment
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="amount" className="flex items-center">
              <IndianRupee className="h-3 w-3 mr-1" />
              Amount Received
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="Enter payment amount"
              className="mt-1"
            />
            
            {verifyType === "partial" && amount > order.pendingAmount && (
              <div className="flex items-center text-amber-500 text-xs mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                <span>Amount exceeds pending balance</span>
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="method">Payment Method</Label>
            <select
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full mt-1 rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Check">Check</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="payment-remarks">Additional Notes</Label>
            <Textarea
              id="payment-remarks"
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any notes about this payment..."
              className="mt-1"
            />
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          type="button"
          onClick={handleVerifyPayment}
          className="w-full"
          disabled={amount <= 0}
        >
          <CreditCardIcon className="h-4 w-4 mr-2" />
          Verify {verifyType === "full" ? "Full" : "Partial"} Payment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentVerificationForm;
