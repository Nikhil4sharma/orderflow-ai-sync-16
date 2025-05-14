
import React, { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Order, Department, OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

interface PaymentVerificationFormProps {
  order: Order;
}

const PaymentVerificationForm: React.FC<PaymentVerificationFormProps> = ({ order }) => {
  const { addStatusUpdate, updateOrder } = useOrders();
  const [remarks, setRemarks] = useState('');
  const [action, setAction] = useState('verify');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update order status to Payment Verified
      const updatedOrder = {
        ...order,
        status: 'Payment Verified' as OrderStatus,
        paymentStatus: 'Paid',
      };

      await updateOrder(updatedOrder);

      // Add status update
      await addStatusUpdate(order.id, {
        department: 'Sales' as Department,
        status: 'Payment Verified' as OrderStatus,
        remarks: remarks || 'Payment verified and confirmed',
      });

      toast.success('Payment verified successfully');
      setRemarks('');
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Failed to verify payment');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Check className="h-5 w-5 mr-2" />
          Verify Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Action</label>
            <Select
              value={action}
              onValueChange={setAction}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verify">Verify Payment</SelectItem>
                <SelectItem value="reject">Report Issue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Remarks</label>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={action === 'verify' ? 'Add any verification notes' : 'Describe the payment issue'}
              rows={3}
            />
          </div>
          
          <Button
            type="submit"
            className={action === 'verify' ? 'w-full bg-green-600 hover:bg-green-700' : 'w-full bg-red-600 hover:bg-red-700'}
          >
            {action === 'verify' ? 'Confirm Payment Verification' : 'Report Payment Issue'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentVerificationForm;
