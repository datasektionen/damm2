import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { url } from "../../common/api"
import { Button } from "../../components/Button/Button"
import { Field } from "../../components/Field/Field"
import { Bag, Box } from "../../types/definitions"
import DataGrid, { Column, SelectColumn } from "react-data-grid";
import { BoxDataGrid } from "./compositions/BoxDataGrid"
import { BagDataGrid } from "./compositions/BagDataGrid"

// interface BoxRow {
//     name: string;
//     id: number;
//     "#bags": number;
//     "#patches": number;
// }

// const boxColumns: Column<BoxRow>[] = [
//     SelectColumn,
//     { key: "id", name: "ID" },
//     { key: "name", name: "Namn" },
//     { key: "#bags", name: "Antal påsar" },
//     { key: "#patches", name: "Antal märken" },
// ]

interface BagRow {
    name: string;
    id: number;
}

const bagColumns: Column<BagRow>[] = [
    SelectColumn,
    { key: "id", name: "ID" },
    { key: "name", name: "Namn" },
    { key: "belongsTo", name: "Tillhör box" },
    { key: "uniquePatches", name: "Antal unika märken" },
    { key: "#patches", name: "Antal märken" },
]

export const StorageHandler = () => {
    const [boxes, setBoxes] = useState<Box[]>([]);
    const [bags, setBags] = useState<Bag[]>([]);
    const [boxName, setBoxName] = useState("");
    const [bagName, setBagName] = useState("");
    const [isCreatingBox, setIsCreatingBox] = useState(false);
    const [isCreatingBag, setIsCreatingBag] = useState(false);
    const [selectedBox, setSelectedBox] = useState("")

    const createBox = useCallback(async () => {
        setIsCreatingBox(true)
        axios.post("/api/storage/box/create", { name: boxName })
            .then(res => {
                setBoxes([...boxes, res.data.body])
                setBoxName("")
            })
            .finally(() => {
                setIsCreatingBox(false)
            })
    }, [boxName])

    useEffect(() => { // boxes is empty in first render, set selectedBox once when boxes is filled with data
        if (!selectedBox && boxes.length !== 0) {
            setSelectedBox(`${boxes[0].id}`)
        }
    })

    const createBag = useCallback(() => {
        setIsCreatingBag(true)

        axios.post("/api/storage/bag/create", { name: bagName, boxId: parseInt(selectedBox) })
            .then(res => {
                setBags([...bags, {
                    ...res.data.body,
                    "#patches": 0,
                    "#uniquePatches": 0,
                    box: {
                        id: selectedBox,
                        name: boxes.find(b => `${b.id}` === selectedBox)?.name,
                    },
                }])
                setBagName("")
            })
            .finally(() => {
                setIsCreatingBag(false)
            })
    }, [bagName, selectedBox])

    const getBoxes = useCallback(() => {
        axios.get("/api/storage/box/all")
            .then(res => {
                setBoxes(res.data.body)
            })
    }, [])

    const getBags = useCallback(() => {
        axios.get("/api/storage/bag/all")
            .then(res => {
                setBags(res.data.body)
            })
    }, [])

    useEffect(getBoxes, []);
    useEffect(getBags, []);

    return (
        <>
            <h3>Skapa box</h3>
            <Field
                placeholder="Namn"
                value={boxName}
                onChange={e => setBoxName(e.target.value)}
            />
            <Button
                label="Skapa"
                onClick={createBox}
                disabled={boxName.length === 0}
                isLoading={isCreatingBox}
            />
            <BoxDataGrid
                boxes={boxes}
                setBoxes={setBoxes}
            />
            <div style={{ borderBottom: "solid 1px #afafaf4f", padding: "10px" }} />

            <h3>Skapa påse</h3>
            <Field
                placeholder="Namn"
                value={bagName}
                onChange={e => setBagName(e.target.value)}
            />
            <select value={selectedBox} onChange={e => setSelectedBox(e.target.value)}>
                {boxes.map(b =>
                    <option key={"box-" + b.id} value={b.id}>{b.name}</option>
                )}
            </select>
            <Button
                label="Skapa"
                onClick={createBag}
                disabled={bagName.length === 0 || !selectedBox}
                isLoading={isCreatingBag}
            />
            <div style={{ borderBottom: "solid 1px #afafaf4f", padding: "10px" }} />
            <BagDataGrid
                bags={bags}
                boxes={boxes}
                setBags={setBags}
            />
        </>
    )
}
