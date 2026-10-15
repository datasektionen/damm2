import { getHotkeyHandler } from '@mantine/hooks';
import { useState } from 'react';

interface CellStringInputProps<Row> {
  row: Row;
  initial: string;
  onSave: (rowId: number, value: string) => Promise<unknown>;
  // onSaveSuccess: (rowId: number, value: string) => Promise<void>;
}

/** Component used in datagrid to edit a cell.
 * Calls `onSave` upon pressing "Enter".
 **/
export function CellStringInput({
  initial = '',
  row,
  onSave,
}: CellStringInputProps<{ id: number }>) {
  const [value, setValue] = useState(initial);

  const save = () => {
    onSave(row.id, value);
  };

  return (
    <div>
      <input
        onKeyDown={getHotkeyHandler([['Enter', save]])}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
