
import React from "react";
import { format, isValid, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import ManualDateInput from "./ui/manual-date-input";

interface DatePickerWithPopoverProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

const DatePickerWithPopover: React.FC<DatePickerWithPopoverProps> = ({
  date,
  onDateChange,
  placeholder = "Select a date",
  className,
  label,
  required = false,
}) => {
  // Convert Date to string in the format YYYY-MM-DD
  const dateToString = (date: Date | undefined): string => {
    if (!date || !isValid(date)) return "";
    return format(date, "yyyy-MM-dd");
  };

  // Convert string to Date
  const stringToDate = (dateStr: string): Date | undefined => {
    if (!dateStr || dateStr.trim() === "") return undefined;
    
    // Try to parse the date using date-fns for better handling
    try {
      const parsedDate = parse(dateStr, "yyyy-MM-dd", new Date());
      
      // Check if the date is valid
      if (isValid(parsedDate)) {
        return parsedDate;
      }
      return undefined;
    } catch (error) {
      console.error("Error parsing date:", error);
      return undefined;
    }
  };

  const handleDateChange = (dateString: string) => {
    onDateChange(stringToDate(dateString));
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label} {required && <span className="text-destructive">*</span>}
        </div>
      )}
      <div className="flex gap-2">
        <ManualDateInput
          value={dateToString(date)}
          onChange={handleDateChange}
          placeholder={placeholder}
          className={cn("flex-grow hover:border-primary transition-colors", className)}
          required={required}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "px-3 border border-input hover:bg-accent hover:text-accent-foreground transition-all hover:border-primary",
                !date && "text-muted-foreground"
              )}
              type="button"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DatePickerWithPopover;
