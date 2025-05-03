
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
import { DatePicker } from "@/components/ui/date-picker";
import { addDays, format } from "date-fns";
import { CalendarClock } from "lucide-react";

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
  const [timeValue, setTimeValue] = useState<string>("");
  const [timeUnit, setTimeUnit] = useState<string>("hours");
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 3));
  const [useDate, setUseDate] = useState<boolean>(false);

  // Parse initial value on component mount
  useEffect(() => {
    if (value) {
      if (value.includes("date:")) {
        // Format: "date: 2023-05-10"
        setUseDate(true);
        const dateStr = value.replace("date:", "").trim();
        try {
          setDate(new Date(dateStr));
        } catch (e) {
          console.error("Invalid date format:", value);
        }
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
  }, []);

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

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    
    if (!useDate) return; // Don't update if we're not using date mode
    
    if (newDate) {
      onChange(`date: ${format(newDate, 'yyyy-MM-dd')}`);
    } else {
      onChange("");
    }
  };

  const toggleMode = () => {
    setUseDate(!useDate);
    
    // Update the value based on the new mode
    if (!useDate) {
      // Switching to date mode
      if (date) {
        onChange(`date: ${format(date, 'yyyy-MM-dd')}`);
      }
    } else {
      // Switching to time mode
      if (timeValue) {
        onChange(`${timeValue} ${timeUnit}`);
      }
    }
  };

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
        <DatePicker
          date={date}
          setDate={handleDateChange}
          className={required ? "border-red-500" : ""}
        />
      ) : (
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
      )}
      <p className="text-xs text-muted-foreground">
        {useDate 
          ? "Select a specific date when this task will be completed" 
          : "Estimate how long this task will take to complete"
        }
      </p>
    </div>
  );
};

export default TimeEstimationInput;
