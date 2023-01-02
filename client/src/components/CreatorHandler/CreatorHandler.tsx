import React from 'react';
import { MultiSelect } from "@mantine/core";

type Person = {
    id: number;
    name: string;
}

interface Props {
    data: Person[];
    selected: string[];
    setSelected: React.Dispatch<React.SetStateAction<string[]>>;
    onCreate: (query: string) => Promise<Person>;
    disabled: boolean;
}
// Component for managing Patch creators, adding and removal
export const CreatorHandler = ({ selected, setSelected, data, onCreate, disabled }: Props) => {
    return (
        <MultiSelect
            data={data.map(p => ({
                value: `${p.id}`, // Should be a string according to documentation
                label: p.name,
            }))}
            placeholder="Välj person(er)"
            searchable
            creatable
            clearable
            nothingFound="Inga personer hittades. Skriv ett namn för att skapa en person."
            getCreateLabel={(query) => `Skapa "${query}"`}
            onCreate={async (query) => {
                const person = await onCreate(query);
                setSelected([...selected, `${person.id}`])
            }}
            value={selected}
            onChange={setSelected}
            disabled={disabled}
        />
    )
};
