
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { IndianRupee, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatIndianRupees } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PaymentProgressCardProps {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  onRecordPayment?: () => void;
  paymentHistory?: Array<{
    id?: string;
    amount: number;
    date: string;
    method: string;
    remarks?: string;
  }>;
  className?: string;
}

const PaymentProgressCard: React.FC<PaymentProgressCardProps> = ({
  totalAmount,
  paidAmount,
  pendingAmount,
  onRecordPayment,
  paymentHistory = [],
  className = '',
}) => {
  const paymentPercent = Math.min(Math.round((paidAmount / totalAmount) * 100), 100);
  const isFullyPaid = pendingAmount <= 0;
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className={`w-full h-1 ${isFullyPaid ? 'bg-green-500' : 'bg-amber-500'}`}></div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <div className={`p-2 rounded-full mr-2 ${isFullyPaid ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>
              {isFullyPaid ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              )}
            </div>
            Payment Information
          </CardTitle>
          
          <span className={`text-sm font-medium px-2 py-1 rounded-md ${
            isFullyPaid ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
          }`}>
            {isFullyPaid ? 'Fully Paid' : 'Payment Required'}
          </span>
        </div>
        
        <CardDescription>
          {isFullyPaid 
            ? 'This order is fully paid and ready to proceed.'
            : 'Payment must be completed before this order can proceed.'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Payment Progress</span>
              <span className="font-medium">{paymentPercent}%</span>
            </div>
            <Progress value={paymentPercent} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/50 rounded-md p-3 flex flex-col">
              <span className="text-xs text-muted-foreground">Total</span>
              <div className="flex items-center mt-1">
                <IndianRupee className="h-3 w-3 mr-1 text-muted-foreground" />
                <span className="text-lg font-semibold">{formatIndianRupees(totalAmount)}</span>
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-md p-3 flex flex-col">
              <span className="text-xs text-muted-foreground">Paid</span>
              <div className="flex items-center mt-1">
                <IndianRupee className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-lg font-semibold text-green-500">{formatIndianRupees(paidAmount)}</span>
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-md p-3 flex flex-col">
              <span className="text-xs text-muted-foreground">Pending</span>
              <div className="flex items-center mt-1">
                <IndianRupee className="h-3 w-3 mr-1 text-amber-500" />
                <span className="text-lg font-semibold text-amber-500">{formatIndianRupees(pendingAmount)}</span>
              </div>
            </div>
          </div>
          
          {paymentHistory && paymentHistory.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Payment History</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto rounded-md border border-border">
                {paymentHistory.map((payment, index) => (
                  <div key={payment.id || index} className="flex items-center justify-between text-xs p-2 border-b border-border last:border-0">
                    <div className="flex items-start flex-col">
                      <span className="font-medium">{new Date(payment.date).toLocaleDateString()}</span>
                      <span className="text-muted-foreground text-xs">{payment.method}</span>
                    </div>
                    <div className="flex items-center">
                      <IndianRupee className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="font-medium">{formatIndianRupees(payment.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {!isFullyPaid && onRecordPayment && (
        <CardFooter className="pt-0">
          <Button onClick={onRecordPayment} className="w-full">
            <CreditCard className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PaymentProgressCard;
