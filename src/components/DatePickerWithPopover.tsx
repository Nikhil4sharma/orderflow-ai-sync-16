
import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ManualDateInput from "./ui/manual-date-input";

interface DatePickerWithPopoverProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

const DatePickerWithPopover: React.FC<DatePickerWithPopoverProps> = ({
  date,
  onDateChange,
  placeholder = "Select a date",
  className,
}) => {
  // Convert Date to string in the format YYYY-MM-DD
  const dateToString = (date: Date | undefined): string => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  // Convert string to Date
  const stringToDate = (dateStr: string): Date | undefined => {
    if (!dateStr || dateStr.trim() === "") return undefined;
    
    // Try to parse the date
    const parsedDate = new Date(dateStr);
    
    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) return undefined;
    
    return parsedDate;
  };

  const handleDateChange = (dateString: string) => {
    onDateChange(stringToDate(dateString));
  };

  return (
    <div className="w-full">
      <ManualDateInput
        value={dateToString(date)}
        onChange={handleDateChange}
        placeholder="YYYY-MM-DD"
        className={className}
      />
    </div>
  );
};

export default DatePickerWithPopover;
