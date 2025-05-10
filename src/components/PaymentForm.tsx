import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { Order } from "@/types";
import { notifyPaymentReceived } from '@/utils/notifications';

interface PaymentFormProps {
  order: Order;
  onPaymentAdded?: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ order, onPaymentAdded }) => {
  const { addPayment } = useOrders();
  const [amount, setAmount] = useState<number>(order.pendingAmount || 0);
  const [method, setMethod] = useState<string>("Bank Transfer");
  const [remarks, setRemarks] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add payment to order
      const formData = { amount, method, remarks };
      await addPayment(order.id, {
        id: Math.random().toString(36).substring(2, 9), // Generate a simple ID
        amount,
        date: new Date().toISOString(),
        method,
        remarks
      });
      
      // Notify about payment
      await notifyPaymentReceived(order.id, order.orderNumber, formData.amount); 
      
      toast.success(`Payment of ₹${amount} recorded successfully`);
      
      // Reset form
      setAmount(0);
      setRemarks("");
      
      // Call callback if provided
      if (onPaymentAdded) {
        onPaymentAdded();
      }
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Record Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="Enter payment amount"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger id="method">
                <SelectValue placeholder="Select payment method" />
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
          
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any notes about this payment"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Recording..." : "Record Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
