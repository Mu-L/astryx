import {useState} from 'react';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {format} from 'date-fns';
import {CalendarIcon} from 'lucide-react';
import type {DateRange} from 'react-day-picker';

export default function HotelDatePicker() {
  const [date, setDate] = useState<DateRange | undefined>();

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn('w-[300px] justify-start text-left font-normal', !date && 'text-muted-foreground')}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>{format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}</>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick check-in and check-out dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            disabled={{before: new Date()}}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}