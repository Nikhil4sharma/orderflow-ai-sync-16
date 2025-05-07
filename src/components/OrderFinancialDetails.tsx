
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { IndianRupee, CheckCircle2, AlertCircle } from "lucide-react";
import { formatIndianRupees } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Order, PaymentStatus } from "@/types";

interface OrderFinancialDetailsProps {
  order: Order;
}

const OrderFinancialDetails: React.FC<OrderFinancialDetailsProps> = ({ order }) => {
  const totalAmount = order.amount || 0;
  const paidAmount = order.paidAmount || 0;
  const pendingAmount = order.pendingAmount || 0;
  const paymentPercent = Math.min(Math.round((paidAmount / totalAmount) * 100), 100);
  
  // If order has product-wise pricing
  const hasProductDetails = order.productStatus && order.productStatus.length > 0 && 
    order.productStatus.some(p => p.price !== undefined);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className={`w-full h-1 ${paymentPercent === 100 ? "bg-green-500" : "bg-amber-500"}`}></div>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Financial Summary</CardTitle>
            <Badge variant={order.paymentStatus === "Paid" ? "success" : 
                  order.paymentStatus === "Partial" ? "warning" : "danger"}>
              {order.paymentStatus}
            </Badge>
          </div>
          <CardDescription>
            Payment details for order #{order.orderNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Payment Progress</span>
                <span className="font-medium">{paymentPercent}%</span>
              </div>
              <Progress value={paymentPercent} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-muted/50 border-none shadow-none">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                  <div className="flex items-center">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    <span className="text-lg font-semibold">{formatIndianRupees(totalAmount)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50 border-none shadow-none">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Paid Amount</p>
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    <span className="text-lg font-semibold">{formatIndianRupees(paidAmount)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50 border-none shadow-none">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Pending Amount</p>
                  <div className="flex items-center text-amber-600 dark:text-amber-400">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    <span className="text-lg font-semibold">{formatIndianRupees(pendingAmount)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center mt-2 p-3 rounded-md bg-muted/30">
              {order.paymentStatus === "Paid" ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                  <div>
                    <p className="font-medium">Payment Complete</p>
                    <p className="text-sm text-muted-foreground">Order is fully paid</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                  <div>
                    <p className="font-medium">
                      {order.paymentStatus === "Partial" ? "Partial Payment" : "Payment Required"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.paymentStatus === "Partial" 
                        ? `${formatIndianRupees(pendingAmount)} payment pending` 
                        : "No payment has been made"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product-wise financial details */}
      {hasProductDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Product Breakdown</CardTitle>
            <CardDescription>Individual pricing for each product in this order</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.productStatus.map((product, index) => (
                  <TableRow key={product.id || index}>
                    <TableCell className="font-medium">{product.name || `Product ${index + 1}`}</TableCell>
                    <TableCell>{product.quantity || 1}</TableCell>
                    <TableCell>
                      {product.unitPrice ? formatIndianRupees(product.unitPrice) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.price ? formatIndianRupees(product.price) : "-"}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Total row */}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                  <TableCell className="text-right font-bold">{formatIndianRupees(totalAmount)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderFinancialDetails;
