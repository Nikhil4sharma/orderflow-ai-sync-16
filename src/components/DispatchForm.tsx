
import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Package, Send, CheckCircle, AlertTriangle } from "lucide-react";
import { Order, CourierPartner, DeliveryType, OrderStatus } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import PermissionGated from "./PermissionGated";

interface DispatchFormProps {
  order: Order;
}

const DispatchForm: React.FC<DispatchFormProps> = ({ order }) => {
  const { updateOrder, addStatusUpdate, verifyOrder, currentUser } = useOrders();
  
  const [address, setAddress] = useState(order.dispatchDetails?.address || "");
  const [contactNumber, setContactNumber] = useState(order.dispatchDetails?.contactNumber || "");
  const [courierPartner, setCourierPartner] = useState<CourierPartner | undefined>(
    order.dispatchDetails?.courierPartner
  );
  const [deliveryType, setDeliveryType] = useState<DeliveryType | undefined>(
    order.dispatchDetails?.deliveryType || "Normal"
  );
  const [trackingNumber, setTrackingNumber] = useState(
    order.dispatchDetails?.trackingNumber || ""
  );
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!address || !contactNumber || !courierPartner || !deliveryType) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Check if payment is complete
    if (order.paymentStatus !== "Paid") {
      toast.error("Full payment is required before dispatch");
      return;
    }

    // Update order with dispatch details
    const updatedOrder = {
      ...order,
      status: "Dispatched" as OrderStatus,
      dispatchDetails: {
        address,
        contactNumber,
        courierPartner,
        deliveryType,
        trackingNumber,
        dispatchDate: new Date().toISOString(),
        verifiedBy: currentUser?.name || "Unknown"
      }
    };

    // Update the order
    updateOrder(updatedOrder);

    // Add status update
    addStatusUpdate(order.id, {
      department: "Sales",
      status: "Dispatched",
      remarks: `Order dispatched via ${courierPartner} (${deliveryType}). ${remarks ? 'Remarks: ' + remarks : ''}`,
    });

    toast.success("Order has been dispatched successfully");
  };

  const handleVerify = () => {
    // Check if payment is complete
    if (order.paymentStatus !== "Paid") {
      toast.error("Full payment is required before verification");
      return;
    }
    
    // Verify the order (changes status to "Verified")
    verifyOrder(order.id);
    toast.success("Order has been verified successfully");
  };

  // Check if order is ready for dispatch
  const isOrderReadyForDispatch = order.status === "Ready to Dispatch";
  const canDispatchOrder = order.status === "Ready to Dispatch" && order.paymentStatus === "Paid";

  return (
    <PermissionGated requiredPermission="dispatch_orders">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            {canDispatchOrder ? "Dispatch Order" : "Verify and Dispatch Order"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order.paymentStatus !== "Paid" && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Payment Required</p>
                <p className="mt-1 text-sm">
                  Full payment must be received before this order can be dispatched.
                  Currently: {order.paidAmount.toLocaleString()} of {order.amount.toLocaleString()} received.
                </p>
              </div>
            </div>
          )}
        
          {isOrderReadyForDispatch && (
            <div className="mb-6">
              <p className="mb-4">
                This order has been marked as ready for dispatch by the Production team. 
                Please verify the order before dispatch.
              </p>
              <PermissionGated requiredPermission="verify_orders">
                <Button 
                  onClick={handleVerify} 
                  className="w-full"
                  disabled={order.paymentStatus !== "Paid"}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Order
                </Button>
              </PermissionGated>
            </div>
          )}

          {canDispatchOrder && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address*</Label>
                <Textarea
                  id="address"
                  placeholder="Enter full delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number*</Label>
                <Input
                  id="contact"
                  placeholder="e.g., +91 9876543210"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="courier">Courier Partner*</Label>
                  <Select
                    value={courierPartner}
                    onValueChange={(value) => setCourierPartner(value as CourierPartner)}
                    required
                  >
                    <SelectTrigger id="courier">
                      <SelectValue placeholder="Select courier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Shree Maruti">Shree Maruti</SelectItem>
                      <SelectItem value="DTDC">DTDC</SelectItem>
                      <SelectItem value="FedEx">FedEx</SelectItem>
                      <SelectItem value="DHL">DHL</SelectItem>
                      <SelectItem value="BlueDart">BlueDart</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery-type">Delivery Type*</Label>
                  <Select
                    value={deliveryType}
                    onValueChange={(value) => setDeliveryType(value as DeliveryType)}
                    required
                  >
                    <SelectTrigger id="delivery-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Express">Express</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tracking">Tracking Number</Label>
                <Input
                  id="tracking"
                  placeholder="e.g., TN123456789"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dispatch-remarks">Remarks</Label>
                <Textarea
                  id="dispatch-remarks"
                  placeholder="Any additional information about dispatch"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={2}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={order.paymentStatus !== "Paid"}
              >
                <Send className="h-4 w-4 mr-2" />
                Dispatch Order
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </PermissionGated>
  );
};

export default DispatchForm;
