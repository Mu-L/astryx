import {useState} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Checkbox} from '@/components/ui/checkbox';
import {Button} from '@/components/ui/button';

const emails = [
  {id: '1', sender: 'Alice', subject: 'Project Update', date: '2024-01-15', preview: 'Sprint results are in...'},
  {id: '2', sender: 'Bob', subject: 'Meeting', date: '2024-01-14', preview: 'Reschedule to 3pm?'},
  {id: '3', sender: 'Carol', subject: 'Design Review', date: '2024-01-13', preview: 'Mockups attached...'},
  {id: '4', sender: 'Dave', subject: 'Invoice', date: '2024-01-12', preview: 'Please find attached...'},
];

export default function EmailInbox() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {selected.size > 0 && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded">
          <span>{selected.size} selected</span>
          <Button size="sm" variant="outline">Archive</Button>
          <Button size="sm" variant="outline">Delete</Button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox onCheckedChange={() => {
                if (selected.size === emails.length) setSelected(new Set());
                else setSelected(new Set(emails.map(e => e.id)));
              }} />
            </TableHead>
            <TableHead>Sender</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Preview</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.map(email => (
            <TableRow key={email.id}>
              <TableCell><Checkbox checked={selected.has(email.id)} onCheckedChange={() => toggle(email.id)} /></TableCell>
              <TableCell>{email.sender}</TableCell>
              <TableCell>{email.subject}</TableCell>
              <TableCell>{email.date}</TableCell>
              <TableCell className="text-muted-foreground">{email.preview}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}