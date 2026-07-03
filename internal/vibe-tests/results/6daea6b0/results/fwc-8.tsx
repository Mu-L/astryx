import {DateRangeInput} from '@astryxdesign/core/DateRangeInput';
import {useState} from 'react';

type DateRange = {start: string; end: string};

export default function HotelDatePicker() {
  const [range, setRange] = useState<DateRange | null>(null);
  const today = new Date().toISOString().split('T')[0];

  return (
    <DateRangeInput
      label="Stay dates"
      description="Select your check-in and check-out dates"
      value={range}
      onChange={setRange}
      min={today}
      placeholder="Select dates"
      size="md"
    />
  );
}