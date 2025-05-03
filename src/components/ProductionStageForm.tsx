
import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Order, ProductionStage, StatusType } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import DatePickerWithPopover from "./DatePickerWithPopover";

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

  const handleSubmit = () => {
    if (!selectedStage) {
      toast.error("Please select a production stage");
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
      // If all stages are completed, mark order as completed
      status: updatedStages.every(s => s.status === "completed") ? "Completed" : order.status
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
    <Card className="glass-card">
      <CardHeader className="border-b border-border/30">
        <CardTitle className="flex items-center">
          Production Stage Update
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
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
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="processing" id="processing" />
                <Label htmlFor="processing" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-amber-500" />
                  Processing
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="completed" />
                <Label htmlFor="completed" className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Completed
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="issue" id="issue" />
                <Label htmlFor="issue" className="flex items-center">
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
              Expected Completion Date
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
          >
            Update Production Stage
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductionStageForm;
