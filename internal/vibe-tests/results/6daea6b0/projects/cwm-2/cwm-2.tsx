import {useState} from 'react';
import {Typeahead} from '@astryxdesign/core/Typeahead';
import {Badge} from '@astryxdesign/core/Badge';
import {Stack} from '@astryxdesign/core/Stack';
import stylex from '@stylexjs/stylex';
// Tailwind available for utility layout

const styles = stylex.create({
  container: {
    maxWidth: 400,
  },
  labelList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    display: 'inline-block',
  },
});

type Label = {name: string; color: string};

const LABELS: Label[] = [
  {name: 'bug', color: '#d73a4a'},
  {name: 'enhancement', color: '#a2eeef'},
  {name: 'documentation', color: '#0075ca'},
  {name: 'good first issue', color: '#7057ff'},
  {name: 'help wanted', color: '#008672'},
  {name: 'question', color: '#d876e3'},
];

export default function LabelPicker() {
  const [selected, setSelected] = useState<Label[]>([]);
  const [current, setCurrent] = useState<Label | null>(null);

  const searchSource = {
    search: (query: string) =>
      LABELS.filter(l => l.name.toLowerCase().includes(query.toLowerCase()))
        .filter(l => !selected.some(s => s.name === l.name)),
    bootstrap: () => LABELS.filter(l => !selected.some(s => s.name === l.name)),
  };

  return (
    <Stack gap={3} xstyle={styles.container}>
      <Typeahead
        label="Add label"
        searchSource={searchSource}
        value={current}
        onChange={(item) => {
          if (item) {
            setSelected(prev => [...prev, item]);
            setCurrent(null);
          }
        }}
        placeholder="Search labels..."
        hasEntriesOnFocus
        renderItem={(item) => (
          <Stack gap={2} direction="horizontal" align="center">
            <span {...stylex.props(styles.colorDot)} style={{backgroundColor: item.color}} />
            {item.name}
          </Stack>
        )}
      />
      <div {...stylex.props(styles.labelList)}>
        {selected.map(label => (
          <Badge key={label.name} color="neutral">
            <span {...stylex.props(styles.colorDot)} style={{backgroundColor: label.color}} />
            {label.name}
          </Badge>
        ))}
      </div>
    </Stack>
  );
}