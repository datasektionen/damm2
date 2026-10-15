import React, { useState } from 'react';
import { MultiSelect } from '@mantine/core';

const CREATE_OPTION = '__create__';

type Person = {
  id: number;
  name: string;
};

interface Props {
  data: Person[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  onCreate: (query: string) => Promise<Person>;
  disabled: boolean;
}
// Component for managing Patch creators, adding and removal
export const CreatorHandler = ({
  selected,
  setSelected,
  data,
  onCreate,
  disabled,
}: Props) => {
  const [search, setSearch] = useState('');
  const query = search.trim();

  const options = data.map((p) => ({
    value: `${p.id}`, // Should be a string according to documentation
    label: p.name,
  }));
  // Mantine 7+ removed `creatable`, so the "create" entry is added manually
  const canCreate =
    query.length > 0 &&
    !data.some((p) => p.name.toLowerCase() === query.toLowerCase());
  if (canCreate) {
    options.push({ value: CREATE_OPTION, label: `Skapa "${query}"` });
  }

  return (
    <MultiSelect
      data={options}
      placeholder="Välj person(er)"
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      hidePickedOptions
      clearable
      nothingFoundMessage="Inga personer hittades. Skriv ett namn för att skapa en person."
      value={selected}
      onChange={async (values) => {
        if (!values.includes(CREATE_OPTION)) {
          setSelected(values);
          return;
        }
        setSearch('');
        const person = await onCreate(query);
        setSelected([...selected, `${person.id}`]);
      }}
      disabled={disabled}
    />
  );
};
