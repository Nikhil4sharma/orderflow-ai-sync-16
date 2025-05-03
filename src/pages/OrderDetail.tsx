import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clipboard, ClipboardCheck, IndianRupee, Clock, Tag, FileText, Phone, MapPin } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import OrderTimeline from "@/components/OrderTimeline";
import PaymentHistory from "@/components/PaymentHistory";
import { Department, OrderStatus, PaymentStatus, StatusType } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format, isAfter, addHours, parseISO } from "date-fns";
import DatePickerWithPopover from "@/components/DatePickerWithPopover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { canViewFinancialData } from "@/lib/mock-data";
import ForwardOrderForm from "@/components/ForwardOrderForm";
import DepartmentStatusForm from "@/components/DepartmentStatusForm";
import ProductionStageForm from "@/components/ProductionStageForm";
import ExportTimelineButton from "@/components/ExportTimelineButton";
import ProductStatusUpdateForm from "@/components/ProductStatusUpdateForm";
import DeliveryInfoCard from "@/components/DeliveryInfoCard";
import MobileBackButton from "@/components/MobileBackButton";
import { canViewAddressDetails } from "@/lib/permissions";
import ProductStatusList from "@/components/ProductStatusList";

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, updateOrder, addStatusUpdate, currentUser } = useOrders();
  const order = orders.find((o) => o.id === id);
  
  // Form state
  const [status, setStatus] = useState<OrderStatus>(order?.status || "New");
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

  // Check if user can view financial data
  const canViewFinancial = canViewFinancialData(currentUser.department, currentUser.role);
  
  // Check if user is from the current department or an admin
  const isCurrentDepartmentOrAdmin = currentUser.department === order?.currentDepartment || currentUser.role === 'Admin';
  
  // Check if user can update production status (only Production department or Admin)
  const canUpdateProductionStatus = currentUser.department === 'Production' || currentUser.role === 'Admin';
  
  // Check if user can update design status (only Design department or Admin)
  const canUpdateDesignStatus = currentUser.department === 'Design' || currentUser.role === 'Admin';
  
  // Check if user can update prepress status (only Prepress department or Admin)
  const canUpdatePrepressStatus = currentUser.department === 'Prepress' || currentUser.role === 'Admin';
  
  // Check if user can view delivery information
  const canViewDeliveryInfo = order ? canViewAddressDetails(currentUser, order) : false;

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setDepartment(order.currentDepartment);
      setTotalAmount(order.amount.toString());
      setPaidAmount(order.paidAmount?.toString() || "0");
      
      // Select first product by default
      if (order.productStatus && order.productStatus.length > 0) {
        setSelectedProduct(order.productStatus[0].id);
      }
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
      lastPaymentDate: new Date().toISOString(),
      paymentHistory: [...(order.paymentHistory || []), newPayment]
    };

    updateOrder(updatedOrder);
    
    // Add status update to context
    addStatusUpdate(order.id, {
      orderId: order.id,
      department: 'Sales',
      status: `Payment Received: ${paymentStatus}`,
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
                <span className="md:text-right">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
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
                    order.paymentStatus === "Partially Paid" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" :
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
          {isCurrentDepartmentOrAdmin && (currentUser.department === "Sales" || currentUser.role === "Admin") && (
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
                        onChange={(e) => setStatus(e.target.value as OrderStatus)}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Ready to Dispatch">Ready to Dispatch</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Issue">Issue</option>
                        <option value="Dispatched">Dispatched</option>
                      </select>
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
                        <select
                          id="department"
                          className="block w-full rounded-md border-0 py-1.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input focus:ring-2 focus:ring-inset focus:ring-primary sm:max-w-xs sm:text-sm sm:leading-6"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value as Department)}
                        >
                          <option value="Sales">Sales</option>
                          <option value="Production">Production</option>
                          <option value="Design">Design</option>
                          <option value="Prepress">Prepress</option>
                        </select>
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
                      <textarea
                        id="remarks"
                        rows={3}
                        className="block w-full rounded-md border-0 py-1.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
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
          {/* Department-Specific Status Update Forms */}
          {isCurrentDepartmentOrAdmin && currentUser.department !== 'Sales' && (
            <ProductStatusUpdateForm 
              order={order} 
              department={currentUser.department}
            />
          )}
        
          {isCurrentDepartmentOrAdmin && order.currentDepartment !== 'Production' && (
            <ForwardOrderForm order={order} />
          )}
          
          {canUpdateDesignStatus && order.currentDepartment === 'Design' && (
            <DepartmentStatusForm order={order} department="Design" />
          )}
          
          {canUpdatePrepressStatus && order.currentDepartment === 'Prepress' && (
            <DepartmentStatusForm order={order} department="Prepress" />
          )}
          
          {canUpdateProductionStatus && order.currentDepartment === 'Production' && (
            <ProductionStageForm order={order} />
          )}
          
          {/* Display Current Department Status */}
          <Card className="glass-card">
            <CardHeader className="border-b border-border/30">
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" /> 
                Workflow Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {order.currentDepartment === 'Design' && (
                <>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <span className="font-medium">Design Status:</span>
                    <span className="md:text-right">
                      <StatusBadge status={order.designStatus || 'Working on it'} />
                    </span>
                  </div>
                  {order.designTimeline && (
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <span className="font-medium">Design Timeline:</span>
                      <span className="md:text-right">{format(new Date(order.designTimeline), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                  {order.designRemarks && (
                    <div className="mt-2">
                      <span className="font-medium">Design Remarks:</span>
                      <p className="text-muted-foreground mt-1">{order.designRemarks}</p>
                    </div>
                  )}
                </>
              )}
              
              {order.currentDepartment === 'Prepress' && (
                <>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <span className="font-medium">Prepress Status:</span>
                    <span className="md:text-right">
                      <StatusBadge status={order.prepressStatus || 'Pending'} />
                    </span>
                  </div>
                  {order.prepressRemarks && (
                    <div className="mt-2">
                      <span className="font-medium">Prepress Remarks:</span>
                      <p className="text-muted-foreground mt-1">{order.prepressRemarks}</p>
                    </div>
                  )}
                </>
              )}
              
              {order.currentDepartment === 'Production' && order.productionStages && order.productionStages.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Production Stages</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.productionStages.map((stage, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-md flex flex-col space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{stage.stage}</span>
                          <span>
                            {stage.status === 'completed' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </span>
                            )}
                            {stage.status === 'processing' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                <Clock className="h-3 w-3 mr-1" />
                                Processing
                              </span>
                            )}
                            {stage.status === 'issue' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Issue
                              </span>
                            )}
                          </span>
                        </div>
                        {stage.timeline && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Timeline:</span>{" "}
                            {format(new Date(stage.timeline), 'MMM dd, yyyy')}
                          </div>
                        )}
                        {stage.remarks && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Remarks:</span>{" "}
                            {stage.remarks}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!['Design', 'Prepress', 'Production'].includes(order.currentDepartment) && (
                <div className="text-center py-4 text-muted-foreground">
                  No specific workflow status for Sales department
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline" className="space-y-6 pt-4">
          <OrderTimeline 
            statusHistory={order.statusHistory} 
            currentUser={currentUser}
            canEditStatusUpdate={canEditStatusUpdate}
          />
        </TabsContent>
        
        {canViewFinancial && (
          <TabsContent value="financial" className="space-y-6 pt-4">
            {/* Payment Record Form */}
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
                        className="block text-sm font-medium leading-6 mb-2"
                      >
                        Payment Date*
                      </label>
                      <DatePickerWithPopover
                        date={paymentDate}
                        onDateChange={setPaymentDate}
                        placeholder="Select payment date"
                      />
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
            
            {/* Payment History */}
            {order.paymentHistory && order.paymentHistory.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <IndianRupee className="h-5 w-5 mr-2" /> Payment History
                </h2>
                <PaymentHistory payments={order.paymentHistory} />
              </div>
            )}
            
            {/* Financial Summary */}
            <Card className="glass-card">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" /> 
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
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
                    <span className="font-medium">Last Payment Date:</span>
                    <span>{format(new Date(order.lastPaymentDate), 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default OrderDetail;
