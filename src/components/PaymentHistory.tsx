
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentRecord } from "@/types";
import { IndianRupee, Calendar, CreditCard, Receipt } from "lucide-react";
import { format } from "date-fns";
import { formatIndianRupees } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PaymentHistoryProps {
  payments: PaymentRecord[];
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments }) => {
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
          <Receipt className="h-12 w-12 mx-auto mb-2 opacity-30" />
          <p>No payment records found</p>
        </CardContent>
      </Card>
    );
  }

  // Sort payments by date (most recent first)
  const sortedPayments = [...payments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate total amount
  const totalAmount = sortedPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-primary" />
            Payment Records
          </div>
          <div className="text-sm flex items-center bg-primary/10 px-3 py-1 rounded-full">
            <IndianRupee className="h-3.5 w-3.5 mr-1 text-primary" />
            <span className="font-medium text-primary">Total: {formatIndianRupees(totalAmount)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="divide-y divide-border/30 space-y-1">
          {sortedPayments.map((payment, index) => (
            <div 
              key={payment.id || index} 
              className="py-4 first:pt-2 last:pb-1 hover:bg-muted/20 rounded-md transition-colors p-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium flex items-center">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    {formatIndianRupees(payment.amount)}
                    <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                      {payment.method}
                    </Badge>
                  </h3>
                  {payment.remarks && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {payment.remarks}
                    </p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground flex items-center bg-muted/40 px-2 py-0.5 rounded">
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
