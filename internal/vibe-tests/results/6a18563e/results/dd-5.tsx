import {useState} from 'react';
import {Table} from '@astryxdesign/core/Table';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {Button} from '@astryxdesign/core/Button';
import {ButtonGroup} from '@astryxdesign/core/ButtonGroup';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import stylex from '@stylexjs/stylex';

const styles = stylex.create({
  bulkBar: {
    padding: 8,
    backgroundColor: 'var(--color-background-wash)',
    borderRadius: 8,
  },
});

interface Email {
  id: string;
  sender: string;
  subject: string;
  date: string;
  preview: string;
  [key: string]: unknown;
}

const emails: Email[] = [
  {id: '1', sender: 'Alice Smith', subject: 'Project Update', date: '2024-01-15', preview: 'The latest sprint results are in...'},
  {id: '2', sender: 'Bob Chen', subject: 'Meeting Tomorrow', date: '2024-01-14', preview: 'Can we reschedule to 3pm?'},
  {id: '3', sender: 'Carol Davis', subject: 'Design Review', date: '2024-01-13', preview: 'Attached are the mockups for...'},
  {id: '4', sender: 'Dave Wilson', subject: 'Invoice #4521', date: '2024-01-12', preview: 'Please find attached the invoice...'},
  {id: '5', sender: 'Eve Taylor', subject: 'Welcome aboard!', date: '2024-01-11', preview: 'We are excited to have you join...'},
];

export default function EmailInbox() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === emails.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(emails.map(e => e.id)));
    }
  };

  return (
    <Stack gap={3}>
      {selectedIds.size > 0 && (
        <div {...stylex.props(styles.bulkBar)}>
          <Stack direction="horizontal" gap={2} align="center">
            <Text>{selectedIds.size} selected</Text>
            <ButtonGroup>
              <Button variant="outlined" size="sm" onPress={() => {}}>Archive</Button>
              <Button variant="outlined" size="sm" onPress={() => {}}>Delete</Button>
              <Button variant="outlined" size="sm" onPress={() => {}}>Mark Read</Button>
            </ButtonGroup>
          </Stack>
        </div>
      )}
      <Table
        data={emails}
        idKey="id"
        hasHover
        columns={[
          {
            key: 'select',
            header: '',
            width: {type: 'pixel', value: 40},
            renderCell: (row) => (
              <CheckboxInput
                label="Select"
                isLabelHidden
                isChecked={selectedIds.has(row.id)}
                onChange={() => toggleSelection(row.id)}
              />
            ),
          },
          {key: 'sender', header: 'Sender'},
          {key: 'subject', header: 'Subject'},
          {key: 'date', header: 'Date'},
          {key: 'preview', header: 'Preview'},
        ]}
      />
    </Stack>
  );
}