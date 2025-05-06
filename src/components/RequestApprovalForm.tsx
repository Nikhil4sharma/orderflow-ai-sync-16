
import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";
import { canRequestApprovalFromSales } from "@/lib/permissions";
import { Order, OrderStatus, Department } from "@/types";

interface RequestApprovalFormProps {
  order: Order;
}

const RequestApprovalForm: React.FC<RequestApprovalFormProps> = ({ order }) => {
  const { updateOrder, addStatusUpdate, currentUser } = useOrders();
  const [approvalReason, setApprovalReason] = useState<string>("");
  
  const canRequestApproval = canRequestApprovalFromSales(currentUser);
  
  const handleRequestApproval = () => {
    if (!approvalReason) {
      toast.error("Please provide details for the approval request");
      return;
    }
    
    // Update the order with pending approval status
    const updatedOrder = {
      ...order,
      status: "Pending Approval" as OrderStatus,
      pendingApprovalFrom: "Sales" as Department,
      approvalReason
    };
    
    updateOrder(updatedOrder);
    
    // Add status update to timeline
    addStatusUpdate(order.id, {
      department: currentUser?.department || "Design",
      status: "Approval Requested",
      remarks: approvalReason
    });
    
    toast.success("Approval request sent to Sales team");
    
    // Reset form
    setApprovalReason("");
  };
  
  if (!canRequestApproval) {
    return null;
  }
  
  return (
    <Card className="glass-card mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Request Sales Team Approval
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="approval-reason"
              className="block text-sm font-medium leading-6"
            >
              Approval Details
            </label>
            <div className="mt-2">
              <Textarea
                id="approval-reason"
                rows={3}
                value={approvalReason}
                onChange={(e) => setApprovalReason(e.target.value)}
                placeholder="Describe what needs approval from the Sales team..."
                className="block w-full rounded-md border-0 py-1.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          
          <Button 
            type="button"
            onClick={handleRequestApproval}
            className="w-full"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Approval Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RequestApprovalForm;
