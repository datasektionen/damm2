import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { Alert } from "../../components/Alert/Alert"
import { Button } from "../../components/Button/Button"
import { Field } from "../../components/Field/Field"
import { Bag, Box } from "../../types/definitions"
import { BagDataGrid } from "../StorageHandler/compositions/BagDataGrid"

export const BagHandler = () => {
    const [boxes, setBoxes] = useState<Box[]>([]);
    const [bags, setBags] = useState<Bag[]>([]);
    const [bagName, setBagName] = useState("");
    const [isCreatingBag, setIsCreatingBag] = useState(false);
    const [selectedBox, setSelectedBox] = useState("")
    const [error, setError] = useState("");

    useEffect(() => { // boxes is empty in first render, set selectedBox once when boxes is filled with data
        if (!selectedBox && boxes.length !== 0) {
            setSelectedBox(`${boxes[0].id}`)
        }
    })

    const createBag = useCallback(() => {
        setIsCreatingBag(true)
        setError("");

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
                }].sort((a: Bag, b: Bag) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
                setBagName("")
            })
            .catch(err => {
                setError(err.response.data.error)
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
            <h3>Skapa påse</h3>
            {error.length !== 0 &&
                <Alert
                    type="error"
                >
                    {error}
                </Alert>
            }
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
