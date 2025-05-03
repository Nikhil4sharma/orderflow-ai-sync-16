
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clipboard, ClipboardCheck, IndianRupee, Clock } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import OrderTimeline from "@/components/OrderTimeline";
import ProductStatusList from "@/components/ProductStatusList";
import PaymentHistory from "@/components/PaymentHistory";
import { Department, OrderStatus, PaymentStatus } from "@/types";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format, isAfter, addHours, parseISO } from "date-fns";

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, updateOrder, addStatusUpdate, currentUser } = useOrders();
  const order = orders.find((o) => o.id === id);
  
  const [status, setStatus] = useState<OrderStatus>(order?.status || "New");
  const [department, setDepartment] = useState<Department>(order?.currentDepartment || "Sales");
  const [remarks, setRemarks] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<string>(order?.amount.toString() || "0");
  const [paidAmount, setPaidAmount] = useState<string>(order?.paidAmount?.toString() || "0");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentRemarks, setPaymentRemarks] = useState<string>("");

  // Check if user can edit the amount (only admin and sales team)
  const canEditAmount = currentUser.department === "Sales" || currentUser.role === "Admin";
  
  // Check if user can view the amount (only admin and sales team)
  const canViewAmount = currentUser.department === "Sales" || currentUser.role === "Admin";

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setDepartment(order.currentDepartment);
      setTotalAmount(order.amount.toString());
      setPaidAmount(order.paidAmount?.toString() || "0");
    }
  }, [order]);

  if (!order) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        <Card className="glass-card">
          <CardContent>Order not found</CardContent>
        </Card>
      </div>
    );
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as OrderStatus);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartment(e.target.value as Department);
  };

  const handleRemarksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRemarks(e.target.value);
  };

  // Check if the status update is within the editable time frame (1 hour)
  const canEditStatusUpdate = (update: any) => {
    if (!update.editableUntil) return false;
    return isAfter(new Date(update.editableUntil), new Date());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate pending amount
    const newTotalAmount = parseFloat(totalAmount) || 0;
    const newPaidAmount = parseFloat(paidAmount) || 0;
    const pendingAmount = Math.max(0, newTotalAmount - newPaidAmount);

    // Determine payment status
    let paymentStatus: PaymentStatus = "Not Paid";
    if (newPaidAmount >= newTotalAmount) {
      paymentStatus = "Paid";
    } else if (newPaidAmount > 0) {
      paymentStatus = "Partially Paid";
    }

    // Optimistic update
    const updatedOrder = { 
      ...order, 
      status, 
      currentDepartment: department,
      amount: newTotalAmount,
      paidAmount: newPaidAmount,
      pendingAmount,
      paymentStatus
    };

    updateOrder(updatedOrder);

    // Add status update to context
    const now = new Date();
    const editableUntil = addHours(now, 1).toISOString();
    
    addStatusUpdate(order.id, {
      orderId: order.id,
      department: department,
      status: status,
      remarks: remarks,
      editableUntil
    });

    // Reset remarks after submitting
    setRemarks("");
    
    toast.success("Order updated successfully");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentDate || !paymentMethod) {
      toast.error("Please fill in required payment details");
      return;
    }

    const newPaymentAmount = parseFloat(paidAmount) || 0;
    const newTotalPaid = (order.paidAmount || 0) + newPaymentAmount;
    const newPendingAmount = Math.max(0, order.amount - newTotalPaid);
    
    // Determine payment status
    let paymentStatus: PaymentStatus = "Not Paid";
    if (newTotalPaid >= order.amount) {
      paymentStatus = "Paid";
    } else if (newTotalPaid > 0) {
      paymentStatus = "Partially Paid";
    }

    // Create new payment record
    const newPayment = {
      id: Math.random().toString(36).substring(2, 9),
      amount: newPaymentAmount,
      date: paymentDate,
      method: paymentMethod,
      remarks: paymentRemarks
    };

    // Update order with new payment information
    const updatedOrder = {
      ...order,
      paidAmount: newTotalPaid,
      pendingAmount: newPendingAmount,
      paymentStatus,
      lastPaymentDate: new Date().toISOString(),
      paymentHistory: [...(order.paymentHistory || []), newPayment]
    };

    updateOrder(updatedOrder);
    
    // Reset form fields
    setPaidAmount("0");
    setPaymentDate("");
    setPaymentMethod("");
    setPaymentRemarks("");
    
    toast.success("Payment recorded successfully");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen dark:bg-slate-900 transition-colors duration-300">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Details Card */}
        <Card className="glass-card">
          <CardHeader className="border-b border-border/30">
            <CardTitle className="flex items-center">
              <Clipboard className="h-5 w-5 mr-2" /> 
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex justify-between">
              <span className="font-medium">Order Number:</span>
              <span>{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Client Name:</span>
              <span>{order.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Order Date:</span>
              <span>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Items:</span>
              <span className="text-right">{order.items.join(", ")}</span>
            </div>
            {canViewAmount && (
              <>
                <div className="flex justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="flex items-center">
                    <IndianRupee className="h-3.5 w-3.5 mr-1" />
                    {formatCurrency(order.amount || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Paid Amount:</span>
                  <span className="flex items-center text-green-500">
                    <IndianRupee className="h-3.5 w-3.5 mr-1" />
                    {formatCurrency(order.paidAmount || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Pending Amount:</span>
                  <span className="flex items-center text-amber-500">
                    <IndianRupee className="h-3.5 w-3.5 mr-1" />
                    {formatCurrency(order.pendingAmount || order.amount || 0)}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span className="font-medium">Current Status:</span>
              <span>
                <StatusBadge status={order.status} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Current Department:</span>
              <span>{order.currentDepartment}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Payment Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                order.paymentStatus === "Paid" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                order.paymentStatus === "Partially Paid" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" :
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}>
                {order.paymentStatus || "Not Paid"}
              </span>
            </div>
            {order.lastPaymentDate && (
              <div className="flex justify-between">
                <span className="font-medium">Last Payment:</span>
                <span className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {format(new Date(order.lastPaymentDate), 'MMM dd, yyyy h:mm a')}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Update Card */}
        <Card className="glass-card">
          <CardHeader className="border-b border-border/30">
            <CardTitle className="flex items-center">
              <ClipboardCheck className="h-5 w-5 mr-2" /> 
              Update Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium leading-6"
                >
                  Status
                </label>
                <div className="mt-2">
                  <select
                    id="status"
                    className="block w-full rounded-md border-0 py-1.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input focus:ring-2 focus:ring-inset focus:ring-primary sm:max-w-xs sm:text-sm sm:leading-6"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Issue">Issue</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium leading-6"
                >
                  Department
                </label>
                <div className="mt-2">
                  <select
                    id="department"
                    className="block w-full rounded-md border-0 py-1.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input focus:ring-2 focus:ring-inset focus:ring-primary sm:max-w-xs sm:text-sm sm:leading-6"
                    value={department}
                    onChange={handleDepartmentChange}
                  >
                    <option value="Sales">Sales</option>
                    <option value="Production">Production</option>
                    <option value="Design">Design</option>
                    <option value="Prepress">Prepress</option>
                  </select>
                </div>
              </div>

              {canEditAmount && (
                <div>
                  <label
                    htmlFor="totalAmount"
                    className="block text-sm font-medium leading-6"
                  >
                    Total Amount (₹)
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="totalAmount"
                      type="number"
                      className="pl-10"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="remarks"
                  className="block text-sm font-medium leading-6"
                >
                  Remarks
                </label>
                <div className="mt-2">
                  <textarea
                    id="remarks"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    value={remarks}
                    onChange={handleRemarksChange}
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full mt-4"
              >
                Update Order Status
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Payment Record Form (only visible to Sales and Admin) */}
      {canEditAmount && (
        <div className="mt-6">
          <Card className="glass-card">
            <CardHeader className="border-b border-border/30">
              <CardTitle className="flex items-center">
                <IndianRupee className="h-5 w-5 mr-2" /> 
                Record Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="paidAmount"
                      className="block text-sm font-medium leading-6"
                    >
                      Amount Received (₹)*
                    </label>
                    <div className="mt-2 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="paidAmount"
                        type="number"
                        className="pl-10"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label
                      htmlFor="paymentDate"
                      className="block text-sm font-medium leading-6"
                    >
                      Payment Date*
                    </label>
                    <div className="mt-2">
                      <Input
                        id="paymentDate"
                        type="datetime-local"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium leading-6"
                  >
                    Payment Method*
                  </label>
                  <div className="mt-2">
                    <select
                      id="paymentMethod"
                      className="block w-full rounded-md border-0 py-1.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      required
                    >
                      <option value="">Select payment method</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="UPI">UPI</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="paymentRemarks"
                    className="block text-sm font-medium leading-6"
                  >
                    Payment Remarks
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="paymentRemarks"
                      rows={2}
                      className="block w-full rounded-md border-0 py-1.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      value={paymentRemarks}
                      onChange={(e) => setPaymentRemarks(e.target.value)}
                      placeholder="Transaction ID, cheque number, etc."
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full mt-4"
                >
                  Record Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Product Status Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Product Status</h2>
        <ProductStatusList orderId={order.id} products={order.productStatus || []} />
      </div>

      {/* Payment History Section (only visible to Sales and Admin) */}
      {canViewAmount && order.paymentHistory && order.paymentHistory.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
          <PaymentHistory payments={order.paymentHistory} />
        </div>
      )}

      {/* Order Timeline */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Order Timeline</h2>
        <OrderTimeline 
          statusHistory={order.statusHistory} 
          currentUser={currentUser}
          canEditStatusUpdate={canEditStatusUpdate}
        />
      </div>
    </div>
  );
};

export default OrderDetail;
