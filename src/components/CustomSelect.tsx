
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
  allowOther?: boolean;
  otherPlaceholder?: string;
}

const CustomSelect = ({ 
  value, 
  onValueChange, 
  options, 
  placeholder, 
  label,
  allowOther = false,
  otherPlaceholder = "Please specify"
}: CustomSelectProps) => {
  const [customValue, setCustomValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === 'other' && allowOther) {
      setShowCustomInput(true);
      onValueChange('');
    } else {
      setShowCustomInput(false);
      setCustomValue('');
      onValueChange(selectedValue);
    }
  };

  const handleCustomInputChange = (inputValue: string) => {
    setCustomValue(inputValue);
    onValueChange(inputValue);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select 
        value={showCustomInput ? 'other' : value} 
        onValueChange={handleSelectChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          {allowOther && (
            <SelectItem value="other">Other</SelectItem>
          )}
        </SelectContent>
      </Select>
      
      {showCustomInput && (
        <Input
          value={customValue}
          onChange={(e) => handleCustomInputChange(e.target.value)}
          placeholder={otherPlaceholder}
          className="mt-2"
        />
      )}
    </div>
  );
};

export default CustomSelect;
