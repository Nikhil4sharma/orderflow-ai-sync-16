
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Truck, Calendar, Package, Phone, MapPin } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { useOrders } from "@/contexts/OrderContext";
import { Order, CourierPartner, DeliveryType, OrderStatus } from "@/types/common";
import { notifyOrderStatusChanged } from "@/utils/notifications";

interface DispatchFormProps {
  order: Order;
}

export const DispatchForm: React.FC<DispatchFormProps> = ({ order }) => {
  const { updateOrder, addStatusUpdate, currentUser } = useOrders();
  
  const [address, setAddress] = useState(order.deliveryAddress || '');
  const [contactNumber, setContactNumber] = useState(order.contactNumber || '');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierPartner, setCourierPartner] = useState<CourierPartner>('Shree Maruti');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('Normal');
  const [dispatchDate, setDispatchDate] = useState<Date | undefined>(new Date());
  const [remarks, setRemarks] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast.error("Please enter the delivery address");
      return;
    }
    
    if (!contactNumber) {
      toast.error("Please enter a contact number");
      return;
    }
    
    if (!dispatchDate) {
      toast.error("Please select a dispatch date");
      return;
    }
    
    try {
      // Create dispatch details object
      const dispatchDetails = {
        address,
        contactNumber,
        courierPartner,
        deliveryType,
        trackingNumber,
        dispatchDate: dispatchDate.toISOString(),
        verifiedBy: currentUser?.name || 'Unknown'
      };
      
      // Update order with dispatch details
      const updatedOrder = {
        ...order,
        status: "Dispatched" as OrderStatus,
        dispatchDetails,
        deliveryAddress: address,
        contactNumber
      };
      
      await updateOrder(updatedOrder);
      
      // Add status update
      await addStatusUpdate(order.id, {
        status: "Dispatched" as OrderStatus,
        remarks: `Order dispatched via ${courierPartner} (${deliveryType}). ${remarks ? `Remarks: ${remarks}` : ''}`
      });
      
      // Notify about dispatch
      await notifyOrderStatusChanged(order.id, order.orderNumber, 'Dispatched', order.currentDepartment);
      
      toast.success("Order dispatched successfully!");
    } catch (error) {
      console.error('Error dispatching order:', error);
      toast.error("Failed to dispatch order");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address" className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 opacity-70" />
            Delivery Address
          </Label>
          <Textarea
            id="address"
            placeholder="Enter complete delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            required
          />
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactNumber" className="flex items-center">
              <Phone className="h-4 w-4 mr-1 opacity-70" />
              Contact Number
            </Label>
            <Input
              id="contactNumber"
              type="text"
              placeholder="Enter contact number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trackingNumber" className="flex items-center">
              <Package className="h-4 w-4 mr-1 opacity-70" />
              Tracking Number (Optional)
            </Label>
            <Input
              id="trackingNumber"
              type="text"
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="courierPartner">Courier Partner</Label>
          <Select
            value={courierPartner}
            onValueChange={(value) => setCourierPartner(value as CourierPartner)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select courier partner" />
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
          <Label htmlFor="deliveryType">Delivery Type</Label>
          <Select
            value={deliveryType}
            onValueChange={(value) => setDeliveryType(value as DeliveryType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select delivery type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="Express">Express</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dispatchDate" className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 opacity-70" />
            Dispatch Date
          </Label>
          <DatePicker
            date={dispatchDate}
            setDate={setDispatchDate}
            label="Dispatch Date"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks (Optional)</Label>
        <Textarea
          id="remarks"
          placeholder="Add any additional notes for dispatch"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={2}
        />
      </div>
      
      <Button type="submit" className="w-full">
        <Truck className="h-4 w-4 mr-2" />
        Dispatch Order
      </Button>
    </form>
  );
};
