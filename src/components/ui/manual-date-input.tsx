
import React, { useState } from "react";
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
  // Handle input change, validate format (YYYY-MM-DD)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
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
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`pl-10 ${className} ${required && !value ? "border-red-500" : ""}`}
          required={required}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Please enter date in YYYY-MM-DD format
      </p>
    </div>
  );
};

export default ManualDateInput;
