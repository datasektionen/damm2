import axios from "axios";
import { useEffect, useState } from "react";
import { IPerson } from "../../types/definitions";
import DataGrid, { Column, SelectColumn } from "react-data-grid";
import { Button } from "../../components/Button/Button";

interface Row {
    id: number;
    name: string;
}

const columns: Column<Row>[] = [
    SelectColumn,
    { key: "id", name: "ID",},
    { key: "name", name: "Namn" },
    { key: "createdAmount", name: "Skapade märken" },
];

const PersonManager = () => {

    const [persons, setPersons] = useState<IPerson[]>([]);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(() => new Set());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const result = await axios.get("/api/donations/persons")
            if (result.status === 200) setPersons(result.data.body);
        })();
    }, [])

    const onDelete = () => {
        setLoading(true);
        axios.post("/api/donations/persons/delete", {
            ids: Array.from(selectedRows)
        })
        .then(() => {
            setPersons(
                persons.filter(p => {
                    if (selectedRows.has(p.id)) return false;
                    else return true;
                })
            );
            setLoading(false);
        })
    }

    const onSelectedRowsChange = (selected: Set<number>) => {
        if (loading) return;
        setSelectedRows(selected)
    }

    return (
        <div>
            <DataGrid
                columns={columns}
                rows={(persons as any).map(x => ({
                    id: x.id,
                    name: x.name,
                    createdAmount: x.createdPatches.length
                })) as any}
                selectedRows={selectedRows}
                onSelectedRowsChange={onSelectedRowsChange}
                rowKeyGetter={(row) => row.id}
            />
            <Button
                label="Radera"
                color="white"
                backgroundColor="red"
                onClick={onDelete}
                isLoading={loading}
            />
        </div>
    )
}

export default PersonManager;
