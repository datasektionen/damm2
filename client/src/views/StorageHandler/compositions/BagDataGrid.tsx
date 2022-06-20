import axios, { AxiosResponse } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataGrid, { Column, SelectColumn, EditorProps } from "react-data-grid";
import { url } from "../../../common/api";
import { Button } from "../../../components/Button/Button";
import { Bag, Box, IPatch } from "../../../types/definitions"
import { groupBy as rowGrouper } from 'lodash';
import { useHotkeys, getHotkeyHandler } from '@mantine/hooks';
import { CellStringInput } from "../../../components/CellStringInput/CellStringInput";


interface BagRow {
    name: string;
    id: string;
    belongsTo: string;
    uniquePatches: number;
    "#patches": number;
    patches: IPatch[];
}

interface Props {
    bags: Bag[];
    boxes: Box[];
    setBags: (bags: Bag[]) => void;
}

const groupByOptions = [
    { label: "Låda", value: "belongsTo" },
]

export const BagDataGrid = ({ bags, boxes, setBags }: Props) => {

    const [selectedRows, setSelectedRows] = useState<Set<string>>(() => new Set());
    const [expandedGroupIds, setExpandedGroupIds] = useState<Set<unknown>>(new Set());

    const [selectedBox, setSelectedBox] = useState<string>("");
    const [assigningBags, setAssigningBags] = useState<boolean>(false);
    const [deletingBags, setDeletingBags] = useState<boolean>(false);
    const [groupBy, setGroupBy] = useState<string[]>([]);

    const updateBagName = async (rowId: number, value: string) => {
        return axios.put("/api/storage/bag/name", {
            bagId: rowId,
            name: value,
        })
            .then(() => {
                const bagToUpdate = bags.find(b => b.id === rowId);
                if (!bagToUpdate) return;
                const next = [
                    ...bags.filter(b => b.id !== rowId),
                    {
                        ...bagToUpdate,
                        name: value,
                    }
                ].sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
                setBags(next)
            })
    }

    const bagColumns: Column<BagRow>[] = useMemo(() => {
        return [
            SelectColumn,
            { key: "id", name: "ID", width: 20 },
            {
                key: "name",
                name: "Namn",
                editable: true,
                editor: ({ row }) => <CellStringInput initial={row.name} row={row} onSave={updateBagName} />,
                formatter: ({ row }) => <div style={{ cursor: "pointer" }}>{row.name}</div>
            },
            {
                key: "belongsTo",
                name: "Tillhör box",
            },
            { key: "uniquePatches", name: "Antal unika märken", formatter: ({ row }) => <div title={row.patches.map(p => p.name).join(", ")}>{row.uniquePatches}</div> },
            { key: "#patches", name: "Antal märken" },
        ]
    }, [boxes, bags]);

    useEffect(() => { // boxes is empty on first render, making our value for selectedBox undefined. Set it as soon as boxes has data
        if (!selectedBox && boxes.length !== 0) {
            setSelectedBox(`${boxes[0].id}`);
        }
    })

    const assignBagsToBox = useCallback(() => {
        if (selectedRows.size === 0) return;
        setAssigningBags(true)

        axios.put("/api/storage/bags/box", {
            bags: Array.from(selectedRows),
            boxId: parseInt(selectedBox),
        })
            .then(() => {
                setSelectedRows(new Set());
                const next: Bag[] = bags.map(b => {
                    if (selectedRows.has(b.id as any)) {
                        return {
                            ...b,
                            boxId: parseInt(selectedBox),
                            box: boxes.find(box => box.id === parseInt(selectedBox))!,
                        }
                    } else return b;
                })
                setBags(next)
            })
            .finally(() => setAssigningBags(false))

    }, [selectedRows, selectedBox]);

    const deleteBags = useCallback(() => {
        if (selectedRows.size === 0) return;
        setDeletingBags(true)

        axios.post("/api/storage/bags/delete", {
            bags: Array.from(selectedRows),
        })
            .then(() => {
                setSelectedRows(new Set());
                const next: Bag[] = bags.reduce((arr: Bag[], bag: Bag) => {
                    if (selectedRows.has(bag.id as any)) return arr;
                    else return [...arr, bag];
                }, []);
                setBags(next)
            })
            .finally(() => setDeletingBags(false))
    }, [selectedRows])

    const toggleGroupBy = (key: string) => {
        if (groupBy.includes(key)) setGroupBy(groupBy.filter(o => o !== key));
        else setGroupBy([...groupBy, key]);
    }

    return (
        <>
            <div>
                Gruppera efter:{" "}
                {groupByOptions.map(g =>
                    <label key={"group-opt-" + g.value}>
                        <input name={g.value} type="checkbox" checked={groupBy.includes(g.value)} onChange={e => toggleGroupBy(e.target.name)} />
                        {" "}
                        {g.label}
                    </label>
                )}
            </div>
            <DataGrid
                columns={bagColumns}
                groupBy={groupBy}
                rows={bags.map(b => ({
                    id: b.id,
                    name: b.name,
                    belongsTo: b.box.name,
                    "#patches": b["#patches"],
                    uniquePatches: b["#uniquePatches"],
                    patches: b.patches ?? []
                })) as any}
                rowKeyGetter={(row) => row.id}
                selectedRows={selectedRows}
                onSelectedRowsChange={setSelectedRows}
                expandedGroupIds={expandedGroupIds}
                onExpandedGroupIdsChange={setExpandedGroupIds}
                rowGrouper={rowGrouper}
            />
            <div>
                Flytta påse/påsar till låda:{" "}
                <select
                    value={selectedBox}
                    onChange={e => setSelectedBox(e.target.value)}
                    defaultValue={boxes[0]?.id}
                >
                    {boxes.map(b => <option key={"opt-box-" + b.name + "-" + b.id} value={b.id}>{b.name}</option>)}
                </select>
                <Button label="Spara" onClick={assignBagsToBox} disabled={selectedRows.size === 0} isLoading={assigningBags} />
            </div>
            <div>
                <Button
                    color="white"
                    backgroundColor="red"
                    label={`Radera pås${selectedRows.size !== 1 ? "ar" : "e"}`}
                    onClick={deleteBags}
                    isLoading={deletingBags}
                    disabled={selectedRows.size === 0}
                />
                <span> Raderar du påsen raderas endast påsen, inte dess innehåll</span>
            </div>
        </>
    )
}
