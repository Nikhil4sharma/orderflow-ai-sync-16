
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Order, PaymentStatus } from '@/types';
import { CreditCard, IndianRupee, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatIndianRupees } from '@/lib/utils';

interface FinancialSummaryCardProps {
  order: Order;
  onRecordPayment?: () => void;
  showRecordPaymentButton?: boolean;
}

const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  order,
  onRecordPayment,
  showRecordPaymentButton = false
}) => {
  // Calculate payment percentage
  const paymentPercent = Math.min(Math.round((order.paidAmount / order.amount) * 100), 100);
  
  // Payment status styling
  const getPaymentStatusStyle = (status: PaymentStatus) => {
    switch(status) {
      case 'Paid':
        return { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: <CheckCircle className="h-4 w-4 mr-1" /> };
      case 'Partial':
        return { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: <AlertCircle className="h-4 w-4 mr-1" /> };
      default:
        return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: <AlertCircle className="h-4 w-4 mr-1" /> };
    }
  };
  
  const statusStyle = getPaymentStatusStyle(order.paymentStatus);
  
  return (
    <Card className="glass-card overflow-hidden">
      <div className={`w-full h-1.5 ${paymentPercent < 100 ? "bg-amber-500" : "bg-green-500"}`}></div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Financial Summary</CardTitle>
          </div>
          <div className={`${statusStyle.bg} ${statusStyle.color} px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center`}>
            {statusStyle.icon}
            {order.paymentStatus}
          </div>
        </div>
        <CardDescription>Payment information for this order</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Payment Progress</span>
            <span className="font-medium">{paymentPercent}%</span>
          </div>
          <Progress value={paymentPercent} className="h-2.5" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-md bg-muted/60 p-4">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="flex items-baseline mt-1">
              <IndianRupee className="h-3 w-3 mr-1" />
              <div className="text-lg font-semibold">{formatIndianRupees(order.amount)}</div>
            </div>
          </div>
          
          <div className="rounded-md bg-muted/60 p-4">
            <div className="text-xs text-muted-foreground">Paid</div>
            <div className="flex items-baseline mt-1">
              <IndianRupee className="h-3 w-3 mr-1 text-green-500" />
              <div className="text-lg font-semibold text-green-500">{formatIndianRupees(order.paidAmount)}</div>
            </div>
          </div>
          
          <div className="rounded-md bg-muted/60 p-4">
            <div className="text-xs text-muted-foreground">Pending</div>
            <div className="flex items-baseline mt-1">
              <IndianRupee className={`h-3 w-3 mr-1 ${order.pendingAmount > 0 ? "text-amber-500" : "text-muted-foreground"}`} />
              <div className={`text-lg font-semibold ${order.pendingAmount > 0 ? "text-amber-500" : "text-muted-foreground"}`}>
                {formatIndianRupees(order.pendingAmount)}
              </div>
            </div>
          </div>
        </div>
        
        {order.paymentHistory && order.paymentHistory.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Payment History</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto border border-border/50 rounded-md divide-y divide-border/50">
              {order.paymentHistory.map((payment, index) => (
                <div key={payment.id || index} className="p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      {formatIndianRupees(payment.amount)}
                    </span>
                    <span className="text-xs bg-muted/50 px-2 py-0.5 rounded">
                      {new Date(payment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs px-2 py-0.5 bg-primary/10 rounded text-primary">{payment.method}</span>
                    {payment.remarks && (
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]" title={payment.remarks}>
                        {payment.remarks}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {showRecordPaymentButton && onRecordPayment && order.paymentStatus !== 'Paid' && (
          <Button 
            onClick={onRecordPayment} 
            className="w-full"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialSummaryCard;
