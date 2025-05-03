
import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from 'lucide-react';

interface TimeEstimationInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeEstimationInput: React.FC<TimeEstimationInputProps> = ({ value, onChange }) => {
  const [timeValue, setTimeValue] = useState<string>('1');
  const [timeUnit, setTimeUnit] = useState<string>('hours');
  
  // Parse initial value if provided
  React.useEffect(() => {
    if (value) {
      try {
        const match = value.match(/(\d+)\s+(hour|hours|day|days|week|weeks)/i);
        if (match) {
          setTimeValue(match[1]);
          setTimeUnit(match[2].toLowerCase().endsWith('s') ? match[2].toLowerCase() : `${match[2].toLowerCase()}s`);
        }
      } catch (e) {
        console.error('Error parsing time estimation value:', e);
      }
    }
  }, []);
  
  const handleTimeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTimeValue(newValue);
    updateParentValue(newValue, timeUnit);
  };
  
  const handleTimeUnitChange = (unit: string) => {
    setTimeUnit(unit);
    updateParentValue(timeValue, unit);
  };
  
  const updateParentValue = (value: string, unit: string) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue <= 0) {
      onChange('');
      return;
    }
    
    // Format the time string properly (singular/plural)
    let formattedUnit = unit;
    if (numericValue === 1 && unit.endsWith('s')) {
      formattedUnit = unit.substring(0, unit.length - 1);
    } else if (numericValue !== 1 && !unit.endsWith('s')) {
      formattedUnit = `${unit}s`;
    }
    
    onChange(`${numericValue} ${formattedUnit}`);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className="w-20">
        <Input
          type="number"
          min="1"
          value={timeValue}
          onChange={handleTimeValueChange}
          className="pl-8"
        />
        <Clock className="h-4 w-4 text-muted-foreground absolute mt-[-28px] ml-2" />
      </div>
      
      <Select value={timeUnit} onValueChange={handleTimeUnitChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Unit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hours">Hours</SelectItem>
          <SelectItem value="days">Days</SelectItem>
          <SelectItem value="weeks">Weeks</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeEstimationInput;
