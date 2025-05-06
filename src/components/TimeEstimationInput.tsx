
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
import ManualDateInput from "./ui/manual-date-input";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";

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
  const [dateValue, setDateValue] = useState<string>("");
  const [useDate, setUseDate] = useState<boolean>(false);
  const isMobile = useIsMobile();

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
      } else {
        onChange("");
      }
    } else {
      // Switching to time mode
      if (timeValue) {
        onChange(`${timeValue} ${timeUnit}`);
      } else {
        onChange("");
      }
    }
  };

  const predefinedOptions = [
    { label: "1 day", value: "1 days" },
    { label: "2 days", value: "2 days" },
    { label: "3 days", value: "3 days" },
    { label: "1 week", value: "7 days" },
    { label: "2 weeks", value: "14 days" },
  ];

  return (
    <div className="space-y-3 bg-background p-4 rounded-lg border border-input/70">
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium">
          Estimated Time {required && <span className="text-red-500">*</span>}
        </Label>
        <Button 
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleMode}
          className="text-xs text-primary flex items-center h-8 px-2"
        >
          <CalendarClock className="h-3.5 w-3.5 mr-1.5" />
          {useDate ? "Use Duration" : "Use Date"}
        </Button>
      </div>
      
      {useDate ? (
        <ManualDateInput
          value={dateValue}
          onChange={handleDateChange}
          required={required}
          label={isMobile ? undefined : "Completion Date"}
          placeholder="YYYY-MM-DD"
        />
      ) : (
        <div className="space-y-3">
          <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-2 gap-4"}`}>
            <div className="space-y-2">
              {!isMobile && <Label>Duration</Label>}
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
            </div>
            <div className="space-y-2">
              {!isMobile && <Label>Unit</Label>}
              <Select value={timeUnit} onValueChange={handleUnitChange}>
                <SelectTrigger className="w-full">
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
          
          <div>
            <Label className="text-sm font-normal text-muted-foreground mb-2 block">
              Quick select:
            </Label>
            <div className="flex flex-wrap gap-2">
              {predefinedOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    const [value, unit] = option.value.split(" ");
                    setTimeValue(value);
                    setTimeUnit(unit);
                    onChange(option.value);
                  }}
                  className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-xs rounded-full transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        {useDate 
          ? "Enter the specific date when this task will be completed" 
          : "Estimate how long this task will take to complete"
        }
      </p>
    </div>
  );
};

export default TimeEstimationInput;
