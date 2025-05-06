import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

interface ManualDateInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const ManualDateInput: React.FC<ManualDateInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  required = false,
  className = "",
}) => {
  const [inputValue, setInputValue] = useState(value);
  
  // Keep local state in sync with prop value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle input change, validate format (YYYY-MM-DD)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Basic validation for date format (YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$|^\d{4}\/\d{2}\/\d{2}$|^$/;
    
    // Only call parent onChange if it's empty or matches format
    if (newValue === "" || datePattern.test(newValue)) {
      // Normalize format to YYYY-MM-DD
      const normalized = newValue.replace(/\//g, '-');
      onChange(normalized);
    }
  };

  // When input loses focus, attempt to format the date properly
  const handleBlur = () => {
    if (!inputValue) return;
    
    // Format to YYYY-MM-DD if possible
    try {
      // Try to parse the entered date
      const date = new Date(inputValue);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setInputValue(formattedDate);
        onChange(formattedDate);
      }
    } catch (error) {
      console.log("Invalid date format");
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`pl-10 ${className} ${required && !value ? "border-red-500" : ""}`}
          required={required}
          aria-label={label || "Date input"}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Please enter date in YYYY-MM-DD format
      </p>
    </div>
  );
};

export default ManualDateInput;
