
import React from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatIndianRupees } from "@/lib/utils";
import { IndianRupee } from "lucide-react";

const FinancialOverviewCard: React.FC = () => {
  const { orders, currentUser } = useOrders();

  // Filter orders for financial calculations (only completed or in-progress)
  const relevantOrders = orders.filter(order => 
    order.status === "Completed" || 
    order.status === "In Progress" ||
    order.status === "Dispatched"
  );

  // Calculate financial metrics
  const totalAmount = relevantOrders.reduce((sum, order) => sum + order.amount, 0);
  const totalPaid = relevantOrders.reduce((sum, order) => sum + order.paidAmount, 0);
  const totalPending = totalAmount - totalPaid;
  
  const paymentPercentage = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

  // Recent payments (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentPayments = relevantOrders
    .flatMap(order => order.paymentHistory || [])
    .filter(payment => new Date(payment.date) > thirtyDaysAgo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Monthly revenue
  const currentMonth = new Date().getMonth();
  const currentMonthPayments = recentPayments.filter(
    payment => new Date(payment.date).getMonth() === currentMonth
  );
  
  const currentMonthRevenue = currentMonthPayments.reduce(
    (sum, payment) => sum + payment.amount, 0
  );

  return (
    <Card className="glass-card">
      <CardHeader className="border-b border-border/30">
        <CardTitle className="flex items-center">
          <IndianRupee className="h-5 w-5 mr-2" />
          Financial Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Payment Progress</span>
            <span className="font-medium">{paymentPercentage}%</span>
          </div>
          <Progress value={paymentPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-md bg-muted/30">
            <div className="text-xs text-muted-foreground">Total Orders</div>
            <div className="text-lg font-semibold mt-1">{formatIndianRupees(totalAmount)}</div>
          </div>
          
          <div className="p-3 rounded-md bg-muted/30">
            <div className="text-xs text-muted-foreground">Paid Amount</div>
            <div className="text-lg font-semibold mt-1 text-green-600">{formatIndianRupees(totalPaid)}</div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Monthly Revenue</span>
            <span className="text-xs text-muted-foreground">Current Month</span>
          </div>
          <div className="p-3 rounded-md bg-primary/10">
            <div className="text-lg font-semibold">{formatIndianRupees(currentMonthRevenue)}</div>
          </div>
        </div>
        
        {recentPayments.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">Recent Payments</div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {recentPayments.slice(0, 3).map((payment, index) => (
                <div key={payment.id || index} className="text-xs p-2 rounded bg-muted/30 flex justify-between">
                  <span>{new Date(payment.date).toLocaleDateString()}</span>
                  <span className="font-medium">{formatIndianRupees(payment.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialOverviewCard;
