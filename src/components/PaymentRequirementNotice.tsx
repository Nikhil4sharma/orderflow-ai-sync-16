
import React from 'react';
import { AlertTriangle, IndianRupee, CreditCardIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { formatIndianRupees } from '@/lib/utils';

interface PaymentRequirementNoticeProps {
  pendingAmount: number;
  onRecordPayment?: () => void;
  showRecordPaymentButton?: boolean;
  className?: string;
}

const PaymentRequirementNotice: React.FC<PaymentRequirementNoticeProps> = ({
  pendingAmount,
  onRecordPayment,
  showRecordPaymentButton = false,
  className = ''
}) => {
  if (pendingAmount <= 0) {
    return null;
  }
  
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
        <div className="flex items-center text-lg font-medium mb-3">
          <IndianRupee className="h-4 w-4 mr-1" />
          <span>{formatIndianRupees(pendingAmount)}</span>
          <span className="ml-1 text-sm font-normal">pending payment</span>
        </div>
        
        {showRecordPaymentButton && onRecordPayment && (
          <Button onClick={onRecordPayment} size="sm" variant="outline" className="mt-1">
            <CreditCardIcon className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default PaymentRequirementNotice;
