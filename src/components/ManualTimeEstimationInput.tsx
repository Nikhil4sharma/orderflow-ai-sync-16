
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarClock } from "lucide-react";
import ManualDateInput from "@/components/ui/manual-date-input";

interface ManualTimeEstimationInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const ManualTimeEstimationInput: React.FC<ManualTimeEstimationInputProps> = ({
  value,
  onChange,
  required = false,
}) => {
  const [timeValue, setTimeValue] = useState<string>("");
  const [timeUnit, setTimeUnit] = useState<string>("hours");
  const [dateValue, setDateValue] = useState<string>("");
  const [useDate, setUseDate] = useState<boolean>(false);

  // Parse initial value on component mount
  useEffect(() => {
    if (value) {
      if (value.includes("date:")) {
        // Format: "date: 2023-05-10"
        setUseDate(true);
        const dateStr = value.replace("date:", "").trim();
        setDateValue(dateStr);
      } else {
        // Format: "5 hours"
        setUseDate(false);
        const parts = value.split(" ");
        if (parts.length === 2) {
          setTimeValue(parts[0]);
          setTimeUnit(parts[1]);
        }
      }
    }
  }, [value]);

  const handleTimeValueChange = (newValue: string) => {
    setTimeValue(newValue);
    
    if (useDate) return; // Don't update if we're using date mode
    
    if (newValue) {
      onChange(`${newValue} ${timeUnit}`);
    } else {
      onChange("");
    }
  };

  const handleUnitChange = (newUnit: string) => {
    setTimeUnit(newUnit);
    
    if (useDate) return; // Don't update if we're using date mode
    
    if (timeValue) {
      onChange(`${timeValue} ${newUnit}`);
    }
  };

  const handleDateChange = (newDate: string) => {
    setDateValue(newDate);
    
    if (!useDate) return; // Don't update if we're not using date mode
    
    if (newDate) {
      onChange(`date: ${newDate}`);
    } else {
      onChange("");
    }
  };

  const toggleMode = () => {
    setUseDate(!useDate);
    
    // Update the value based on the new mode
    if (!useDate) {
      // Switching to date mode
      if (dateValue) {
        onChange(`date: ${dateValue}`);
      }
    } else {
      // Switching to time mode
      if (timeValue) {
        onChange(`${timeValue} ${timeUnit}`);
      }
    }
  };

  const predefinedDurations = [
    { label: "1 day", value: "1 days" },
    { label: "2 days", value: "2 days" },
    { label: "3 days", value: "3 days" },
    { label: "1 week", value: "7 days" },
    { label: "1 month", value: "30 days" },
  ];

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Estimated Time for Completion {required && <span className="text-red-500">*</span>}</Label>
        <button 
          type="button"
          onClick={toggleMode}
          className="text-xs text-blue-500 flex items-center"
        >
          <CalendarClock className="h-3 w-3 mr-1" />
          {useDate ? "Switch to duration" : "Switch to specific date"}
        </button>
      </div>
      
      {useDate ? (
        <ManualDateInput
          value={dateValue}
          onChange={handleDateChange}
          required={required}
          placeholder="YYYY-MM-DD"
        />
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Enter time"
              value={timeValue}
              onChange={(e) => handleTimeValueChange(e.target.value)}
              min="0"
              step="0.5"
              required={required}
              className={required && !timeValue ? "border-red-500" : ""}
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
          
          <div className="flex flex-wrap gap-2">
            {predefinedDurations.map((duration) => (
              <button
                key={duration.value}
                type="button"
                onClick={() => {
                  const [value, unit] = duration.value.split(" ");
                  setTimeValue(value);
                  setTimeUnit(unit);
                  onChange(duration.value);
                }}
                className="px-3 py-1 bg-muted/50 hover:bg-muted text-xs rounded-full"
              >
                {duration.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        {useDate 
          ? "Enter a specific date when this task will be completed (YYYY-MM-DD)" 
          : "Estimate how long this task will take to complete"
        }
      </p>
    </div>
  );
};

export default ManualTimeEstimationInput;
