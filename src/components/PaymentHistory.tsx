
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentRecord } from "@/types";
import { IndianRupee, Calendar } from "lucide-react";
import { format } from "date-fns";

interface PaymentHistoryProps {
  payments: PaymentRecord[];
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments }) => {
  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (!payments || payments.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center text-muted-foreground">
          No payment records found
        </CardContent>
      </Card>
    );
  }

  // Sort payments by date (most recent first)
  const sortedPayments = [...payments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="divide-y divide-border/30">
          {sortedPayments.map((payment) => (
            <div 
              key={payment.id} 
              className="py-4 first:pt-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium flex items-center">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    {formatCurrency(payment.amount)}
                    <span className="ml-2 px-2 py-0.5 bg-primary/10 rounded-full text-xs">
                      {payment.method}
                    </span>
                  </h3>
                  {payment.remarks && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {payment.remarks}
                    </p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {formatDate(payment.date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
