import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clipboard, ClipboardCheck, IndianRupee, Clock, Tag, FileText } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import OrderTimeline from "@/components/OrderTimeline";
import PaymentHistory from "@/components/PaymentHistory";
import { Department, OrderStatus, PaymentStatus, StatusType } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format, isAfter, addHours } from "date-fns";
import DatePickerWithPopover from "@/components/DatePickerWithPopover";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ForwardOrderForm from "@/components/ForwardOrderForm";
import DepartmentStatusForm from "@/components/DepartmentStatusForm";
import ProductionStageForm from "@/components/ProductionStageForm";
import ExportTimelineButton from "@/components/ExportTimelineButton";
import ProductStatusUpdateForm from "@/components/ProductStatusUpdateForm";
import DeliveryInfoCard from "@/components/DeliveryInfoCard";
import MobileBackButton from "@/components/MobileBackButton";
import { canViewAddressDetails } from "@/lib/permissions";
import ProductStatusList from "@/components/ProductStatusList";
import { canViewFinancialData, orderNeedsApproval } from "@/lib/utils";
import ApprovalForm from "@/components/ApprovalForm";
import OrderFinancialDetails from "@/components/OrderFinancialDetails";
import EnhancedPaymentForm from "@/components/EnhancedPaymentForm";
import FinancialSummaryCard from "@/components/FinancialSummaryCard";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ForwardToDepartmentForm from "@/components/ForwardToDepartmentForm";

function formatDateSafe(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime())
    ? date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
    : "N/A";
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, updateOrder, addStatusUpdate, currentUser, markReadyForDispatch } = useOrders();
  const order = orders.find((o) => o.id === id);
  
  // Form state
  const [status, setStatus] = useState<OrderStatus>(order?.status || "In Progress");
  const [department, setDepartment] = useState<Department>(order?.currentDepartment || "Sales");
  const [remarks, setRemarks] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<string>(order?.amount.toString() || "0");
  const [paidAmount, setPaidAmount] = useState<string>(order?.paidAmount?.toString() || "0");
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentRemarks, setPaymentRemarks] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [productStatus, setProductStatus] = useState<StatusType>("processing");
  const [activeTab, setActiveTab] = useState<string>("details");
  const [needsApproval, setNeedsApproval] = useState<boolean>(false);
  const [statusHistory, setStatusHistory] = useState(order?.statusHistory || []);

  // Check if user can view financial data
  const canViewFinancial = canViewFinancialData(currentUser?.department, currentUser?.role);
  
  // Check if user is from the current department or an admin
  const isCurrentDepartmentOrAdmin = !!order && !!currentUser && (currentUser.department === order.currentDepartment || currentUser.role === 'Admin');
  
  // Check if user can update production status (only Production department or Admin)
  const canUpdateProductionStatus = currentUser?.department === 'Production' || currentUser?.role === 'Admin';
  
  // Check if user can update design status (only Design department or Admin)
  const canUpdateDesignStatus = currentUser?.department === 'Design' || currentUser?.role === 'Admin';
  
  // Check if user can update prepress status (only Prepress department or Admin)
  const canUpdatePrepressStatus = currentUser?.department === 'Prepress' || currentUser?.role === 'Admin';
  
  // Check if user can view delivery information
  const canViewDeliveryInfo = order ? canViewAddressDetails(currentUser, order) : false;
  
  // Check if this order needs approval from Sales
  const canApproveOrder = (currentUser?.department === 'Sales' || currentUser?.role === 'Admin');

  const isCurrentDepartmentUser = !!order && !!currentUser && currentUser.department === order.currentDepartment;
  const canShowStatusUpdateForm = isCurrentDepartmentUser || (currentUser && currentUser.role === "Admin");

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setDepartment(order.currentDepartment);
      setTotalAmount(order.amount.toString());
      setPaidAmount(order.paidAmount?.toString() || "0");
      setNeedsApproval(orderNeedsApproval(order));
      if (order.productStatus && order.productStatus.length > 0) {
        setSelectedProduct(order.productStatus[0].id);
      }
    }
    // eslint-disable-next-line
  }, [order?.id]);

  // Real-time Firestore listener for statusHistory
  useEffect(() => {
    if (!order?.id) return;
    const orderRef = doc(db, "orders", order.id);
    const unsubscribe = onSnapshot(orderRef, (docSnap) => {
      if (docSnap.exists()) {
        setStatusHistory(docSnap.data().statusHistory || []);
      }
    });
    return () => unsubscribe();
  }, [order?.id]);

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

  if (!currentUser) {
    return <div>Loading...</div>;
  }

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
      paymentStatus = "Partial";
    }

    // Prepare updated order
    const updatedOrder = { 
      ...order, 
      status, 
      currentDepartment: department,
      amount: newTotalAmount,
      paidAmount: newPaidAmount,
      pendingAmount,
      paymentStatus
    };

    // If a product is selected, update its status
    if (selectedProduct && selectedProduct !== "none") {
      updatedOrder.productStatus = (order.productStatus || []).map(product => 
        product.id === selectedProduct 
          ? { ...product, status: productStatus, remarks: remarks || product.remarks }
          : product
      );
    }

    updateOrder(updatedOrder);

    // Add status update to context
    const now = new Date();
    const editableUntil = addHours(now, 1).toISOString();
    
    addStatusUpdate(order.id, {
      orderId: order.id,
      department: department,
      status: status,
      remarks: remarks,
      editableUntil,
      selectedProduct: selectedProduct !== "none" ? selectedProduct : undefined
    });

    // Reset remarks after submitting
    setRemarks("");
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
      paymentStatus = "Partial";
    }

    // Create new payment record
    const newPayment = {
      id: Math.random().toString(36).substring(2, 9),
      amount: newPaymentAmount,
      date: paymentDate.toISOString(),
      method: paymentMethod,
      remarks: paymentRemarks
    };

    // Update order with new payment information
    const updatedOrder = {
      ...order,
      paidAmount: newTotalPaid,
      pendingAmount: newPendingAmount,
      paymentStatus,
      paymentHistory: [...(order.paymentHistory || []), newPayment]
    };

    updateOrder(updatedOrder);
    
    // Add status update to context
    addStatusUpdate(order.id, {
      orderId: order.id,
      department: 'Sales',
      status: order.status,
      remarks: `Payment of ${newPaymentAmount} received via ${paymentMethod}. ${paymentRemarks}`,
    });
    
    // Reset form fields
    setPaidAmount("0");
    setPaymentDate(undefined);
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

  const handleApprovalComplete = () => {
    // Refresh data
    setNeedsApproval(false);
    toast.success("Approval completed successfully");
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen dark:bg-slate-900 transition-colors duration-300">
      <MobileBackButton to="/" label="Back to Dashboard" className="mb-4 block md:hidden" />
      
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="hidden md:flex"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        
        <div className="flex gap-2">
          <ExportTimelineButton 
            orderNumber={order.orderNumber}
            orderClientName={order.clientName}
            statusHistory={order.statusHistory}
          />
        </div>
      </div>

      {/* Show approval form for Sales/Admin if this order needs approval */}
      {needsApproval && canApproveOrder && (
        <ApprovalForm 
          order={order}
          onApproved={handleApprovalComplete}
          onRejected={handleApprovalComplete}
        />
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          {canViewFinancial && (
            <TabsTrigger value="financial">Financial</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="details" className="space-y-6 pt-4">
          <Card className="glass-card">
            <CardHeader className="border-b border-border/30">
              <CardTitle className="flex items-center">
                <Clipboard className="h-5 w-5 mr-2" /> 
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <span className="font-medium">Order Number:</span>
                <span className="md:text-right">{order.orderNumber}</span>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <span className="font-medium">Client Name:</span>
                <span className="md:text-right">{order.clientName}</span>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <span className="font-medium">Order Date:</span>
                <span className="md:text-right">{formatDateSafe(order.createdAt)}</span>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <span className="font-medium">Items:</span>
                <span className="md:text-right">{order.items.join(", ")}</span>
              </div>
              {canViewFinancial && (
                <>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="flex items-center md:justify-end">
                      <IndianRupee className="h-3.5 w-3.5 mr-1" />
                      {formatCurrency(order.amount || 0)}
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <span className="font-medium">Paid Amount:</span>
                    <span className="flex items-center text-green-500 md:justify-end">
                      <IndianRupee className="h-3.5 w-3.5 mr-1" />
                      {formatCurrency(order.paidAmount || 0)}
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <span className="font-medium">Pending Amount:</span>
                    <span className="flex items-center text-amber-500 md:justify-end">
                      <IndianRupee className="h-3.5 w-3.5 mr-1" />
                      {formatCurrency(order.pendingAmount || order.amount || 0)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <span className="font-medium">Current Status:</span>
                <span className="md:text-right">
                  <StatusBadge status={order.status} />
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <span className="font-medium">Current Department:</span>
                <span className="md:text-right">{order.currentDepartment}</span>
              </div>
              {canViewFinancial && (
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <span className="font-medium">Payment Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.paymentStatus === "Paid" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                    order.paymentStatus === "Partial" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" :
                    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}>
                    {order.paymentStatus || "Not Paid"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Delivery Information Card - conditionally shown */}
          {(order.deliveryAddress || order.contactNumber || order.dispatchDetails?.address) && (
            <DeliveryInfoCard 
              order={order}
              currentUser={currentUser}
            />
          )}
          
          {/* Product Status List */}
          {order.productStatus && order.productStatus.length > 0 && (
            <div className="mt-6">
              <ProductStatusList
                orderId={order.id}
                products={order.productStatus}
                canEdit={isCurrentDepartmentOrAdmin && ["Design", "Prepress", "Production"].includes(currentUser.department)}
              />
            </div>
          )}
          
          {/* Only show status update section for Sales/Admin */}
          {canShowStatusUpdateForm && currentUser.department !== "Design" && (
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
                      <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Ready to Dispatch">Ready to Dispatch</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Issue">Issue</SelectItem>
                          <SelectItem value="Dispatched">Dispatched</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {currentUser.role === 'Admin' && (
                    <div>
                      <label
                        htmlFor="department"
                        className="block text-sm font-medium leading-6"
                      >
                        Department
                      </label>
                      <div className="mt-2">
                        <Select value={department} onValueChange={(v) => setDepartment(v as Department)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="Production">Production</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="Prepress">Prepress</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {canViewFinancial && (
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
                      <Textarea
                        id="remarks"
                        rows={3}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Enter any additional details or comments"
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
          )}
        </TabsContent>
        
        <TabsContent value="workflow" className="space-y-6 pt-4">
          {/* Department-Specific Workflow Actions */}
          {currentUser.role === 'Admin' && (
            <>
              {/* Admin sees all forms for debugging/override */}
              <ProductStatusUpdateForm order={order} department={order.currentDepartment} />
              <DepartmentStatusForm order={order} department={order.currentDepartment} />
              <ForwardOrderForm order={order} />
              <ProductionStageForm order={order} />
            </>
          )}
          {/* Sales Team: Only see approval forms, payment confirmation, dispatch approval */}
          {currentUser.department === 'Sales' && currentUser.role !== 'Admin' && (
            <>
              {order.status === 'Pending Approval' && (
                <ApprovalForm order={order} />
              )}
              {/* Payment confirmation and dispatch approval UI can be added here if needed */}
            </>
          )}
          {/* Design Team: Only see send for approval to Sales and forward to Prepress */}
          {currentUser.department === 'Design' && currentUser.role !== 'Admin' && order.currentDepartment === 'Design' && (
            <>
              <DepartmentStatusForm order={order} department="Design" />
              {/* Only show Forward to Prepress if not already forwarded */}
              {order.designStatus !== 'Forwarded to Prepress' && (
                <ForwardToDepartmentForm order={order} targetDepartment="Prepress" />
              )}
            </>
          )}
          {/* Prepress Team: Only see send for approval to Sales and (after approval) forward to Production */}
          {currentUser.department === 'Prepress' && currentUser.role !== 'Admin' && order.currentDepartment === 'Prepress' && (
            <>
              <DepartmentStatusForm order={order} department="Prepress" />
              {/* Only show Forward to Production if approved by Sales */}
              {order.prepressStatus === 'Working on it' && (
                <ForwardToDepartmentForm order={order} targetDepartment="Production" />
              )}
            </>
          )}
          {/* Production Team: Only see status update, ready to dispatch, delivery/tracking after ready */}
          {currentUser.department === 'Production' && currentUser.role !== 'Admin' && order.currentDepartment === 'Production' && (
            <>
              <ProductionStageForm order={order} />
              {/* Ready to Dispatch button enabled only if paymentStatus === 'Paid' */}
              {order.paymentStatus === 'Paid' && order.status !== 'Ready to Dispatch' && (
                <Button onClick={() => markReadyForDispatch(order.id)}>
                  Mark Ready to Dispatch
                </Button>
              )}
              {/* Delivery/tracking details UI after ready to dispatch can be added here */}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="timeline" className="space-y-6 pt-4">
          <OrderTimeline 
            statusHistory={statusHistory} 
            currentUser={currentUser}
            canEditStatusUpdate={canEditStatusUpdate}
            order={order}
          />
        </TabsContent>
        
        {canViewFinancial && (
          <TabsContent value="financial" className="space-y-6 pt-4">
            <OrderFinancialDetails order={order} />
            
            {/* Enhanced Payment Form */}
            <EnhancedPaymentForm 
              order={order} 
              onPaymentRecorded={() => setActiveTab("financial")}
            />
            
            {/* Payment History */}
            {order.paymentHistory && order.paymentHistory.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <IndianRupee className="h-5 w-5 mr-2" /> Payment History
                </h2>
                <PaymentHistory payments={order.paymentHistory} />
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default OrderDetail;
