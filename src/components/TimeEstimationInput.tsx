
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";

interface TimeEstimationInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const TimeEstimationInput: React.FC<TimeEstimationInputProps> = ({
  value,
  onChange,
  required = false,
}) => {
  const [timeValue, setTimeValue] = React.useState<string>(value.split(" ")[0] || "");
  const [timeUnit, setTimeUnit] = React.useState<string>(value.split(" ")[1] || "hours");

  const handleValueChange = (newValue: string) => {
    setTimeValue(newValue);
    if (newValue) {
      onChange(`${newValue} ${timeUnit}`);
    } else {
      onChange("");
    }
  };

  const handleUnitChange = (newUnit: string) => {
    setTimeUnit(newUnit);
    if (timeValue) {
      onChange(`${timeValue} ${newUnit}`);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="estimated-time" className="flex items-center">
        <Clock className="h-4 w-4 mr-2" />
        Estimated Time for Completion {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="grid grid-cols-2 gap-2">
        <Input
          id="estimated-time"
          type="number"
          placeholder="Enter time"
          value={timeValue}
          onChange={(e) => handleValueChange(e.target.value)}
          min="0"
          step="0.5"
          required={required}
        />
        <Select value={timeUnit} onValueChange={handleUnitChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hours">Hours</SelectItem>
            <SelectItem value="days">Days</SelectItem>
            <SelectItem value="weeks">Weeks</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TimeEstimationInput;
