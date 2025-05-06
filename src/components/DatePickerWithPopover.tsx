
import React from "react";
import { format, isValid, parse } from "date-fns";
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
    <div className="w-full">
      <ManualDateInput
        label={label}
        value={dateToString(date)}
        onChange={handleDateChange}
        placeholder={placeholder}
        className={cn(className)}
        required={required}
      />
    </div>
  );
};

export default DatePickerWithPopover;
