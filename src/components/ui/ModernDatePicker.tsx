import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./modern-datepicker.css";

interface ModernDatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | null) => void;
  required?: boolean;
}

const ModernDatePicker: React.FC<ModernDatePickerProps> = ({ date, setDate, required }) => (
  <DatePicker
    selected={date}
    onChange={setDate}
    className="w-full rounded-lg border px-3 py-2 bg-background text-foreground shadow focus:ring-2 focus:ring-primary"
    calendarClassName="modern-calendar"
    popperClassName="modern-calendar-popper"
    placeholderText="Select date"
    showPopperArrow={false}
    dateFormat="dd MMM yyyy"
    required={required}
  />
);

export default ModernDatePicker; 