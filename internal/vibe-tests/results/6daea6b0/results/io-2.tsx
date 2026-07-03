import {useState} from 'react';
import {Typeahead} from '@astryxdesign/core/Typeahead';

type Suggestion = {id: string; label: string};

function createSearchSource() {
  return {
    search: async (query: string): Promise<Suggestion[]> => {
      const response = await fetch(
        `https://api.example.com/suggest?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return data.results.map((r: {id: string; name: string}) => ({
        id: r.id,
        label: r.name,
      }));
    },
    bootstrap: () => [] as Suggestion[],
  };
}

export default function AutocompleteInput() {
  const [value, setValue] = useState<Suggestion | null>(null);
  const searchSource = createSearchSource();

  return (
    <Typeahead
      label="Search"
      searchSource={searchSource}
      value={value}
      onChange={setValue}
      placeholder="Type to search..."
      debounceMs={300}
      emptySearchResultsText="No results found"
      renderItem={(item) => item.label}
    />
  );
}