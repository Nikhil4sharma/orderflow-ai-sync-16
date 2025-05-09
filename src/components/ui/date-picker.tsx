"use client"

import * as React from "react"
import { format, isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
  label?: string
  required?: boolean
  placeholder?: string
}

export function DatePicker({ 
  date, 
  setDate, 
  className,
  label,
  required = false,
  placeholder = "Pick a date" 
}: DatePickerProps) {
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && isValid(selectedDate)) {
      setDate(selectedDate);
    } else {
      setDate(undefined);
    }
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label} {required && <span className="text-destructive">*</span>}
        </div>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date && isValid(date) ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
