
import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ApprovalResponseFormProps {
  order: Order;
}

const ApprovalResponseForm: React.FC<ApprovalResponseFormProps> = ({ order }) => {
  const { updateOrder, addStatusUpdate, currentUser } = useOrders();
  const [responseType, setResponseType] = useState<"approve" | "reject">("approve");
  const [remarks, setRemarks] = useState<string>("");
  
  // Only show if order is pending approval and current user is from Sales
  if (order.status !== "Pending Approval" || 
      order.pendingApprovalFrom !== "Sales" || 
      currentUser?.department !== "Sales") {
    return null;
  }
  
  const handleResponse = () => {
    if (!remarks) {
      toast.error("Please provide feedback with your response");
      return;
    }
    
    // Update order based on response
    const updatedOrder = {
      ...order,
      status: responseType === "approve" ? "In Progress" as OrderStatus : "On Hold" as OrderStatus,
      pendingApprovalFrom: undefined,
      approvalReason: undefined
    };
    
    updateOrder(updatedOrder);
    
    // Add status update to timeline
    addStatusUpdate(order.id, {
      department: "Sales",
      status: responseType === "approve" ? "Approved" : "Rejected",
      remarks: remarks
    });
    
    toast.success(`Design has been ${responseType === "approve" ? "approved" : "rejected"}`);
    
    // Reset form
    setRemarks("");
  };
  
  return (
    <Card className="glass-card mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          Approval Response
        </CardTitle>
      </CardHeader>
      <CardContent>
        {order.approvalReason && (
          <div className="mb-4 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Approval Request:</p>
            <p className="text-sm mt-1">{order.approvalReason}</p>
          </div>
        )}
        
        <form className="space-y-4">
          <div>
            <Label className="mb-2 block">Response</Label>
            <RadioGroup 
              value={responseType} 
              onValueChange={(value) => setResponseType(value as "approve" | "reject")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="approve" id="approve" />
                <Label htmlFor="approve" className="flex items-center text-green-500">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reject" id="reject" />
                <Label htmlFor="reject" className="flex items-center text-red-500">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <label
              htmlFor="remarks"
              className="block text-sm font-medium leading-6"
            >
              Feedback
            </label>
            <div className="mt-2">
              <Textarea
                id="remarks"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={responseType === "approve" ? "Provide any additional instructions..." : "Explain why the design was rejected..."}
                className="block w-full rounded-md border-0 py-1.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          
          <Button 
            type="button"
            onClick={handleResponse}
            className={`w-full ${responseType === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
          >
            {responseType === "approve" ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : (
              <XCircle className="h-4 w-4 mr-2" />
            )}
            {responseType === "approve" ? "Approve Design" : "Reject Design"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApprovalResponseForm;
