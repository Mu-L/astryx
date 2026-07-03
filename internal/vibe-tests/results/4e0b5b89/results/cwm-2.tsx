import {useState} from 'react';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';

const labels = [
  {name: 'bug', color: '#d73a4a'},
  {name: 'enhancement', color: '#a2eeef'},
  {name: 'documentation', color: '#0075ca'},
  {name: 'good first issue', color: '#7057ff'},
  {name: 'help wanted', color: '#008672'},
];

export default function LabelPicker() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<typeof labels>([]);

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">Add labels</Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search labels..." />
            <CommandList>
              <CommandEmpty>No label found.</CommandEmpty>
              <CommandGroup>
                {labels.map(label => (
                  <CommandItem key={label.name} onSelect={() => {
                    setSelected(prev => prev.some(l => l.name === label.name) ? prev : [...prev, label]);
                    setOpen(false);
                  }}>
                    <span className="h-3 w-3 rounded-full mr-2" style={{backgroundColor: label.color}} />
                    {label.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-2">
        {selected.map(label => (
          <Badge key={label.name} variant="secondary">
            <span className="h-2 w-2 rounded-full mr-1" style={{backgroundColor: label.color}} />
            {label.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}