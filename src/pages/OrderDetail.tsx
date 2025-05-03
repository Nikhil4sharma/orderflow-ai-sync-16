
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import OrderTimeline from "@/components/OrderTimeline";
import { format } from "date-fns";
import { findOrderById, getProductionStages } from "@/lib/mock-data";
import { ArrowLeft, FileTextIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Department, Order, ProductionStage, StatusType } from "@/types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, addStatusUpdate, updateOrder } = useOrders();
  const navigate = useNavigate();

  // Find the order by id
  const order = orders.find((o) => o.id === id);
  
  // State for form inputs
  const [selectedDepartment, setSelectedDepartment] = useState<Department>(
    order?.currentDepartment || "Sales"
  );
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "New");
  const [remarks, setRemarks] = useState("");
  const [selectedStage, setSelectedStage] = useState<ProductionStage | "">("");
  const [selectedStageStatus, setSelectedStageStatus] = useState<StatusType>("processing");

  if (!order) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleStatusUpdate = () => {
    if (!selectedDepartment || !selectedStatus) {
      toast.error("Please fill all required fields");
      return;
    }

    // Add the status update
    addStatusUpdate(order.id, {
      orderId: order.id,
      department: selectedDepartment,
      status: selectedStatus,
      remarks: remarks.trim() ? remarks : undefined,
    });

    // If it's a production status update and a stage is selected
    if (selectedDepartment === "Production" && selectedStage) {
      const updatedOrder = { ...order };
      
      // Initialize productionStages if it doesn't exist
      if (!updatedOrder.productionStages) {
        updatedOrder.productionStages = [];
      }
      
      // Find if the stage already exists
      const stageIndex = updatedOrder.productionStages.findIndex(
        (s) => s.stage === selectedStage
      );
      
      if (stageIndex >= 0) {
        // Update existing stage
        updatedOrder.productionStages[stageIndex] = {
          ...updatedOrder.productionStages[stageIndex],
          status: selectedStageStatus,
          timeline: new Date().toISOString(),
          remarks: remarks.trim() ? remarks : undefined,
        };
      } else {
        // Add new stage
        updatedOrder.productionStages.push({
          stage: selectedStage,
          status: selectedStageStatus,
          timeline: new Date().toISOString(),
          remarks: remarks.trim() ? remarks : undefined,
        });
      }
      
      // Update the order
      updateOrder(updatedOrder);
    }

    // Reset form
    setRemarks("");
    setSelectedStage("");
    
    toast.success("Order status updated successfully");
  };

  // Status options based on department
  const getStatusOptions = (department: Department) => {
    switch (department) {
      case "Sales":
        return ["New", "In Progress", "Completed", "On Hold"];
      case "Production":
        return ["In Progress", "On Hold", "Issue", "Completed"];
      case "Design":
        return ["In Progress", "Pending Feedback", "On Hold", "Completed"];
      case "Prepress":
        return ["Pending", "Reviewing", "Ready", "Completed"];
      default:
        return ["New", "In Progress", "Completed"];
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Order Details Column */}
        <div className="w-full lg:w-2/3">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
              <p className="text-muted-foreground">
                {order.clientName} | Created: {formatDate(order.createdAt)}
              </p>
            </div>
            <StatusBadge status={order.status} className="text-sm" />
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Order Details</h3>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Amount:</span> ${order.amount.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Department:</span> {order.currentDepartment}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Items</h3>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, index) => (
                      <Badge key={index} variant="outline" className="bg-brand-lightPurple">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="timeline">
            <TabsList className="mb-4">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="production">Production Status</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline">
              <OrderTimeline updates={order.statusHistory} />
            </TabsContent>
            
            <TabsContent value="production">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Production Stages</h3>
                
                {order.productionStages && order.productionStages.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {getProductionStages().map((stage) => {
                      const stageData = order.productionStages?.find(s => s.stage === stage);
                      return (
                        <Card key={stage} className="overflow-hidden">
                          <div className={`h-2 ${stageData ? 
                            stageData.status === 'completed' ? 'bg-status-completed' : 
                            stageData.status === 'issue' ? 'bg-status-issue' : 
                            'bg-status-processing'
                            : 'bg-gray-200'}`}
                          />
                          <CardContent className="pt-4">
                            <h4 className="font-medium">{stage}</h4>
                            <div className="text-sm mt-1">
                              <p className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <span>
                                  {stageData ? 
                                    <StatusBadge status={stageData.status} /> : 
                                    "Not Started"}
                                </span>
                              </p>
                              {stageData?.timeline && (
                                <p className="flex justify-between mt-1">
                                  <span className="text-muted-foreground">Updated:</span>
                                  <span>{formatDate(stageData.timeline)}</span>
                                </p>
                              )}
                              {stageData?.remarks && (
                                <p className="mt-2 text-xs text-muted-foreground">{stageData.remarks}</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No production stages started yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="documents">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Order Documents</h3>
                <div className="text-center py-10 border border-dashed rounded-lg">
                  <FileTextIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No documents available</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Documents will be available when Google Sheets integration is complete
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Update Status Column */}
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-4">Update Status</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={selectedDepartment}
                    onValueChange={(value) => setSelectedDepartment(value as Department)}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Sales", "Production", "Design", "Prepress"].map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {getStatusOptions(selectedDepartment).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedDepartment === "Production" && (
                  <>
                    <div>
                      <Label htmlFor="production-stage">Production Stage</Label>
                      <Select
                        value={selectedStage}
                        onValueChange={(value) => setSelectedStage(value as ProductionStage)}
                      >
                        <SelectTrigger id="production-stage">
                          <SelectValue placeholder="Select Stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {getProductionStages().map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {stage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedStage && (
                      <div>
                        <Label htmlFor="stage-status">Stage Status</Label>
                        <Select
                          value={selectedStageStatus}
                          onValueChange={(value) => setSelectedStageStatus(value as StatusType)}
                        >
                          <SelectTrigger id="stage-status">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {["processing", "completed", "issue"].map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                )}
                
                <div>
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    placeholder="Add any comments or notes here..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                
                <Button onClick={handleStatusUpdate} className="w-full">
                  Update Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
