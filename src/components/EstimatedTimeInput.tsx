
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
import { useState } from "react";

interface EstimatedTimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

const EstimatedTimeInput: React.FC<EstimatedTimeInputProps> = ({
  value,
  onChange,
}) => {
  const [timeValue, setTimeValue] = useState<string>(value.split(" ")[0] || "");
  const [timeUnit, setTimeUnit] = useState<string>(value.split(" ")[1] || "hours");

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
      <Label>Estimated Time for Completion</Label>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          placeholder="Enter time"
          value={timeValue}
          onChange={(e) => handleValueChange(e.target.value)}
          min="0"
          step="0.5"
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

export default EstimatedTimeInput;
