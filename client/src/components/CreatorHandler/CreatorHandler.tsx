import React, { useCallback, useMemo } from 'react';
import { MultiSelect, Select } from '@mantine/core';

type Person = {
  id: number;
  name: string;
};

interface Props {
  data: Person[];
  selected: string[];
  setSelected: (values: string[]) => void;
  onCreate: (query: string) => Promise<Person>;
  disabled: boolean;
  multiSelect?: boolean;
}

const nothingFound =
  'Inga personer hittades. Skriv ett namn för att skapa en person.';
const style: React.CSSProperties = { width: '100%' };

// Component for managing Patch creators, adding and removal
export const CreatorHandler = ({
  selected,
  setSelected,
  data,
  onCreate,
  disabled,
  multiSelect = true,
}: Props) => {
  const mappedData = useMemo(() => {
    return data.map((p) => ({
      value: `${p.id}`, // Should be a string according to documentation
      label: p.name,
    }));
  }, [data]);

  const getCreateLabel = useCallback((query) => `Skapa "${query}"`, []);

  const create = useCallback(
    async (query) => {
      const person = await onCreate(query);
      setSelected([...selected, `${person.id}`]);
    },
    [setSelected]
  );

  if (multiSelect) {
    return (
      <MultiSelect
        data={mappedData}
        placeholder="Välj person(er)"
        searchable
        creatable
        clearable
        nothingFound={nothingFound}
        getCreateLabel={getCreateLabel}
        onCreate={create}
        value={selected}
        onChange={setSelected}
        disabled={disabled}
        style={style}
      />
    );
  } else {
    return (
      <Select
        data={mappedData}
        placeholder="Välj person"
        searchable
        creatable
        nothingFound={nothingFound}
        getCreateLabel={getCreateLabel}
        onCreate={create}
        value={selected.length > 0 ? selected[0] : null}
        onChange={(value) => setSelected(value ? [value] : [])}
        disabled={disabled}
        style={style}
      />
    );
  }
};
