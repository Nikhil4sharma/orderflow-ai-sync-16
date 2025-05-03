
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order, User } from "@/types";
import { Phone, MapPin } from "lucide-react";
import { canViewAddressDetails } from "@/lib/permissions";

interface DeliveryInfoCardProps {
  order: Order;
  currentUser: User;
  className?: string;
}

const DeliveryInfoCard: React.FC<DeliveryInfoCardProps> = ({ 
  order, 
  currentUser,
  className 
}) => {
  // Check if user can view delivery details
  const canViewDetails = canViewAddressDetails(currentUser, order);
  
  // If no delivery details exist or user can't view them, return null
  if (!canViewDetails) {
    return null;
  }
  
  // Get the address and contact from order or dispatch details
  const address = order.deliveryAddress || order.dispatchDetails?.address;
  const contactNumber = order.contactNumber || order.dispatchDetails?.contactNumber;
  
  // If no address or contact, show placeholder
  if (!address && !contactNumber) {
    return (
      <Card className={`glass-card ${className || ""}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            No delivery information available.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`glass-card ${className || ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Delivery Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {address && (
          <div className="flex">
            <div className="flex-shrink-0 mr-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Delivery Address</span>
              <p className="mt-1">{address}</p>
            </div>
          </div>
        )}
        
        {contactNumber && (
          <div className="flex">
            <div className="flex-shrink-0 mr-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Contact Number</span>
              <p className="mt-1">{contactNumber}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryInfoCard;
