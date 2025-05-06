
import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Order, ProductionStage, StatusType } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, AlertTriangle, CheckCircle, Clock, Settings } from "lucide-react";
import DatePickerWithPopover from "./DatePickerWithPopover";
import { Progress } from "./ui/progress";

interface ProductionStageFormProps {
  order: Order;
}

const ProductionStageForm: React.FC<ProductionStageFormProps> = ({ order }) => {
  const { updateOrder } = useOrders();
  
  // Form state
  const [selectedStage, setSelectedStage] = useState<ProductionStage | "">("");
  const [stageStatus, setStageStatus] = useState<StatusType>("processing");
  const [remarks, setRemarks] = useState("");
  const [timeline, setTimeline] = useState<Date | undefined>(undefined);
  
  // Production stages
  const productionStages: ProductionStage[] = [
    "Printing",
    "Pasting",
    "Cutting",
    "Foiling", 
    "Letterpress",
    "Embossed", 
    "Diecut",
    "Quality Check",
    "Ready to Dispatch"
  ];
  
  // Check if payment is complete
  const isPaymentComplete = order.paymentStatus === "Paid";
  
  // Calculate completion percentage of production stages
  const getProductionCompletion = () => {
    if (!order.productionStages || order.productionStages.length === 0) return 0;
    
    const completedStages = order.productionStages.filter(stage => 
      stage.status === "completed"
    ).length;
    
    return Math.round((completedStages / order.productionStages.length) * 100);
  };

  const handleSubmit = () => {
    if (!selectedStage) {
      toast.error("Please select a production stage");
      return;
    }
    
    // For Ready to Dispatch stage, check if payment is complete
    if (selectedStage === "Ready to Dispatch" && !isPaymentComplete) {
      toast.error("Full payment must be received before marking as Ready to Dispatch");
      return;
    }
    
    // Check if timeline is provided for Ready to Dispatch
    if (selectedStage === "Ready to Dispatch" && !timeline) {
      toast.error("Expected completion date is required for Ready to Dispatch status");
      return;
    }
    
    const currentStages = order.productionStages || [];
    
    // Check if this stage already exists
    const stageIndex = currentStages.findIndex(s => s.stage === selectedStage);
    
    let updatedStages;
    if (stageIndex >= 0) {
      // Update existing stage
      updatedStages = [...currentStages];
      updatedStages[stageIndex] = {
        ...updatedStages[stageIndex],
        status: stageStatus,
        remarks: remarks || updatedStages[stageIndex].remarks,
        timeline: timeline ? timeline.toISOString() : updatedStages[stageIndex].timeline
      };
    } else {
      // Add new stage
      updatedStages = [
        ...currentStages,
        {
          stage: selectedStage,
          status: stageStatus,
          remarks: remarks,
          timeline: timeline ? timeline.toISOString() : undefined
        }
      ];
    }
    
    // Update order
    const updatedOrder = {
      ...order,
      productionStages: updatedStages,
      // Set expected completion date if Ready to Dispatch
      expectedCompletionDate: selectedStage === "Ready to Dispatch" && timeline ? 
        timeline.toISOString() : order.expectedCompletionDate,
      // If Ready to Dispatch is completed and payment is received, update status
      status: selectedStage === "Ready to Dispatch" && stageStatus === "completed" && isPaymentComplete ? 
        "Ready to Dispatch" : order.status
    };
    
    updateOrder(updatedOrder);
    toast.success(`Production stage ${selectedStage} updated`);
    
    // Reset form
    setSelectedStage("");
    setStageStatus("processing");
    setRemarks("");
    setTimeline(undefined);
  };
  
  return (
    <Card className="glass-card overflow-hidden">
      <div className={`w-full h-1 ${getProductionCompletion() < 100 ? "bg-amber-500" : "bg-green-500"}`}></div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Production Stage Update</CardTitle>
              <CardDescription>Update the current production stage</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {order.productionStages && order.productionStages.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Production Progress</span>
              <span className="font-medium">{getProductionCompletion()}%</span>
            </div>
            <Progress value={getProductionCompletion()} className="h-2" />
            
            <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
              {order.productionStages.map((stage, index) => (
                <div key={index} className="bg-muted/30 p-2 rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    {stage.status === "completed" ? (
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    ) : stage.status === "processing" ? (
                      <Clock className="h-4 w-4 mr-2 text-amber-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                    )}
                    <span className="text-sm font-medium">{stage.stage}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stage.timeline && new Date(stage.timeline).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      
        {selectedStage === "Ready to Dispatch" && !isPaymentComplete && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              Full payment must be received before order can be marked as Ready to Dispatch.
              Please coordinate with the Sales team to verify payment status.
            </p>
          </div>
        )}
        
        <form className="space-y-4">
          <div>
            <label
              htmlFor="stage"
              className="block text-sm font-medium leading-6"
            >
              Production Stage
            </label>
            <div className="mt-2">
              <Select
                value={selectedStage}
                onValueChange={(value) => setSelectedStage(value as ProductionStage)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select production stage" />
                </SelectTrigger>
                <SelectContent>
                  {productionStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-3">Stage Status</div>
            <RadioGroup
              value={stageStatus}
              onValueChange={(value) => setStageStatus(value as StatusType)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2 bg-muted/30 p-2 rounded-md">
                <RadioGroupItem value="processing" id="processing" />
                <Label htmlFor="processing" className="flex items-center w-full">
                  <Clock className="h-4 w-4 mr-2 text-amber-500" />
                  Processing
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-muted/30 p-2 rounded-md">
                <RadioGroupItem value="completed" id="completed" />
                <Label htmlFor="completed" className="flex items-center w-full">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Completed
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-muted/30 p-2 rounded-md">
                <RadioGroupItem value="issue" id="issue" />
                <Label htmlFor="issue" className="flex items-center w-full">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                  Issue
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <label
              htmlFor="timeline"
              className="block text-sm font-medium leading-6 mb-2"
            >
              Expected Completion Date {selectedStage === "Ready to Dispatch" && <span className="text-red-500">*</span>}
            </label>
            <DatePickerWithPopover
              date={timeline}
              onDateChange={setTimeline}
              placeholder="Select expected completion date"
            />
          </div>
          
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
                placeholder="Add notes about this production stage..."
                className="block w-full rounded-md border-0 py-1.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          
          <Button 
            type="button"
            onClick={handleSubmit}
            className="w-full mt-4"
            disabled={selectedStage === "Ready to Dispatch" && !isPaymentComplete}
          >
            Update Production Stage
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductionStageForm;
