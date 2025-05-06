
import React from 'react';
import { AlertTriangle, IndianRupee, CreditCard, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { formatIndianRupees } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface PaymentRequirementNoticeProps {
  pendingAmount: number;
  totalAmount?: number;
  onRecordPayment?: () => void;
  showRecordPaymentButton?: boolean;
  className?: string;
}

const PaymentRequirementNotice: React.FC<PaymentRequirementNoticeProps> = ({
  pendingAmount,
  totalAmount,
  onRecordPayment,
  showRecordPaymentButton = false,
  className = ''
}) => {
  if (pendingAmount <= 0) {
    return null;
  }

  // Calculate payment percentage if totalAmount is provided
  const paymentPercent = totalAmount && totalAmount > 0
    ? Math.min(Math.round(((totalAmount - pendingAmount) / totalAmount) * 100), 100)
    : 0;
  
  return (
    <Alert variant="destructive" className={`mb-4 border-amber-500 ${className}`}>
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="font-medium flex items-center">
        Payment Required
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">
          Full payment must be received before this order can proceed. Currently:
        </p>
        
        {totalAmount && totalAmount > 0 && (
          <div className="mb-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Payment Progress</span>
              <span className="font-medium">{paymentPercent}%</span>
            </div>
            <Progress value={paymentPercent} className="h-2" />
            
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-background/10 p-2 rounded-md">
                <div className="text-xs text-muted-foreground">Total Amount</div>
                <div className="flex items-center mt-1">
                  <IndianRupee className="h-3 w-3 mr-1" />
                  <span className="font-medium">{formatIndianRupees(totalAmount)}</span>
                </div>
              </div>
              
              <div className="bg-background/10 p-2 rounded-md">
                <div className="text-xs text-muted-foreground">Paid Amount</div>
                <div className="flex items-center mt-1">
                  <IndianRupee className="h-3 w-3 mr-1" />
                  <span className="font-medium">{formatIndianRupees(totalAmount - pendingAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center text-lg font-medium mb-3 bg-background/10 p-2 rounded-md">
          <div className="flex items-center">
            <IndianRupee className="h-4 w-4 mr-1" />
            <span>{formatIndianRupees(pendingAmount)}</span>
          </div>
          <ArrowRight className="mx-2 h-4 w-4" />
          <span className="text-sm font-normal">pending payment</span>
        </div>
        
        {showRecordPaymentButton && onRecordPayment && (
          <Button onClick={onRecordPayment} size="sm" variant="outline" className="mt-1 w-full sm:w-auto">
            <CreditCard className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default PaymentRequirementNotice;
