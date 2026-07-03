import {useState, useEffect, useCallback} from 'react';
import {Input} from '@/components/ui/input';
import {Command, CommandEmpty, CommandGroup, CommandItem, CommandList} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function AutocompleteInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) { setResults([]); return; }
    fetch(`/api/suggest?q=${encodeURIComponent(debouncedQuery)}`)
      .then(r => r.json())
      .then(data => setResults(data.suggestions || []))
      .catch(() => setResults([]));
  }, [debouncedQuery]);

  return (
    <div className="relative w-full max-w-sm">
      <Popover open={open && results.length > 0} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            placeholder="Type to search..."
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
          />
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {results.map(r => (
                  <CommandItem key={r} onSelect={() => { setQuery(r); setOpen(false); }}>
                    {r}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}