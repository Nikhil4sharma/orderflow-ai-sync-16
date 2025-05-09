import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (
            <>
              {format(value.from, 'dd/MM/yyyy')} - {value.to ? format(value.to, 'dd/MM/yyyy') : ''}
            </>
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export { DateRangePicker };
export default DateRangePicker; 