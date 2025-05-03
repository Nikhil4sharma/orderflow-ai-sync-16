
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { format } from "date-fns";
import { Order } from "@/types";

interface DispatchDetailsProps {
  order: Order;
}

const DispatchDetails: React.FC<DispatchDetailsProps> = ({ order }) => {
  if (!order.dispatchDetails) {
    return null;
  }

  const {
    address,
    contactNumber,
    courierPartner,
    deliveryType,
    trackingNumber,
    dispatchDate,
    verifiedBy
  } = order.dispatchDetails;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="h-5 w-5 mr-2" />
          Dispatch Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {address && (
          <div>
            <span className="font-medium">Delivery Address:</span>
            <p className="text-muted-foreground whitespace-pre-line mt-1">{address}</p>
          </div>
        )}

        {contactNumber && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Contact Number:</span>
            <span>{contactNumber}</span>
          </div>
        )}

        {courierPartner && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Courier Partner:</span>
            <span>{courierPartner}</span>
          </div>
        )}

        {deliveryType && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Delivery Type:</span>
            <span>{deliveryType}</span>
          </div>
        )}

        {trackingNumber && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Tracking Number:</span>
            <span>{trackingNumber}</span>
          </div>
        )}

        {dispatchDate && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Dispatched On:</span>
            <span>{format(new Date(dispatchDate), "MMM d, yyyy")}</span>
          </div>
        )}

        {verifiedBy && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Verified By:</span>
            <span>{verifiedBy}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DispatchDetails;
