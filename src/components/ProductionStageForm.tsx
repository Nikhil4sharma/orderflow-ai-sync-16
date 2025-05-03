
import React, { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Order, ProductionStage, StatusType } from "@/types";
import { toast } from "sonner";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { getProductionStages } from "@/lib/mock-data";
import DatePickerWithPopover from "./DatePickerWithPopover";

interface ProductionStageFormProps {
  order: Order;
}

const ProductionStageForm: React.FC<ProductionStageFormProps> = ({ order }) => {
  const { updateOrder, addStatusUpdate } = useOrders();
  const [selectedStage, setSelectedStage] = useState<ProductionStage | ''>('');
  const [status, setStatus] = useState<StatusType>('processing');
  const [remarks, setRemarks] = useState<string>('');
  const [timeline, setTimeline] = useState<Date | undefined>(undefined);
  
  const productionStages = getProductionStages();
  
  // Get current stage data if exists
  const getCurrentStageData = () => {
    if (!order.productionStages || !selectedStage) return null;
    return order.productionStages.find(stage => stage.stage === selectedStage);
  };
  
  const handleSubmit = () => {
    if (!selectedStage) {
      toast.error("Please select a production stage");
      return;
    }
    
    const currentStage = getCurrentStageData();
    const updatedOrder = { ...order };
    
    // Initialize productionStages if it doesn't exist yet
    if (!updatedOrder.productionStages) {
      updatedOrder.productionStages = [];
    }
    
    // Create or update the selected stage
    if (currentStage) {
      // Update existing stage
      updatedOrder.productionStages = updatedOrder.productionStages.map(stage => 
        stage.stage === selectedStage ? {
          ...stage,
          status,
          remarks: remarks || stage.remarks,
          timeline: timeline ? timeline.toISOString() : stage.timeline
        } : stage
      );
    } else {
      // Add new stage entry
      updatedOrder.productionStages.push({
        stage: selectedStage,
        status,
        remarks,
        timeline: timeline ? timeline.toISOString() : undefined
      });
    }
    
    // Update general order status if all stages are completed
    const allStagesCompleted = updatedOrder.productionStages
      .filter(stage => productionStages.includes(stage.stage))
      .every(stage => stage.status === 'completed');
    
    if (allStagesCompleted && updatedOrder.productionStages.length === productionStages.length) {
      updatedOrder.status = 'Completed';
    } else if (status === 'issue') {
      updatedOrder.status = 'Issue';
    } else {
      updatedOrder.status = 'In Progress';
    }
    
    updateOrder(updatedOrder);
    
    // Add status update to timeline
    addStatusUpdate(order.id, {
      orderId: order.id,
      department: 'Production',
      status: `${selectedStage}: ${status === 'completed' ? 'Completed' : status === 'issue' ? 'Issue' : 'In Progress'}`,
      remarks: remarks
    });
    
    toast.success(`Production stage '${selectedStage}' updated successfully`);
    
    // Reset form
    setRemarks("");
  };
  
  // When stage selection changes, populate form with existing data
  const handleStageChange = (value: string) => {
    setSelectedStage(value as ProductionStage);
    
    const stageData = order.productionStages?.find(s => s.stage === value);
    if (stageData) {
      setStatus(stageData.status);
      setRemarks(stageData.remarks || '');
      setTimeline(stageData.timeline ? new Date(stageData.timeline) : undefined);
    } else {
      // Reset form when selecting a new stage
      setStatus('processing');
      setRemarks('');
      setTimeline(undefined);
    }
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
              htmlFor="production-stage"
              className="block text-sm font-medium leading-6"
            >
              Production Stage
            </label>
            <div className="mt-2">
              <Select
                value={selectedStage}
                onValueChange={handleStageChange}
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
          
          {selectedStage && (
            <>
              <div>
                <Label className="block text-sm font-medium leading-6">Stage Status</Label>
                <RadioGroup 
                  value={status} 
                  onValueChange={(value) => setStatus(value as StatusType)}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="processing" id="status-processing" />
                    <Label htmlFor="status-processing" className="text-amber-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Processing
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="completed" id="status-completed" />
                    <Label htmlFor="status-completed" className="text-green-500 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="issue" id="status-issue" />
                    <Label htmlFor="status-issue" className="text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
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
                  placeholder="Select timeline"
                />
              </div>
              
              <div>
                <label
                  htmlFor="stage-remarks"
                  className="block text-sm font-medium leading-6"
                >
                  Remarks
                </label>
                <div className="mt-2">
                  <Textarea
                    id="stage-remarks"
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add notes about stage progress..."
                    className="block w-full rounded-md border-0 py-1.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              
              <Button 
                type="button"
                onClick={handleSubmit}
                className="w-full mt-4"
              >
                Update {selectedStage} Status
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductionStageForm;
