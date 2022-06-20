import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { Alert } from "../../components/Alert/Alert"
import { Button } from "../../components/Button/Button"
import { Field } from "../../components/Field/Field"
import { Box } from "../../types/definitions"
import { BoxDataGrid } from "../StorageHandler/compositions/BoxDataGrid"

export const BoxHandler = () => {
    const [boxes, setBoxes] = useState<Box[]>([]);
    const [boxName, setBoxName] = useState("");
    const [isCreatingBox, setIsCreatingBox] = useState(false);
    const [error, setError] = useState("");

    const createBox = useCallback(async () => {
        setIsCreatingBox(true)
        setError("");
        axios.post("/api/storage/box/create", { name: boxName })
            .then(res => {
                setBoxes([...boxes, { ...res.data.body, "#patches": 0, "#uniquePatches": 0, bags: [] }])
                setBoxName("")
            })
            .catch(err => {
                setError(err.response.data.error)
            })
            .finally(() => {
                setIsCreatingBox(false)
            })
    }, [boxName])

    const getBoxes = useCallback(() => {
        axios.get("/api/storage/box/all")
            .then(res => {
                setBoxes(res.data.body)
            })
    }, [])

    useEffect(getBoxes, []);

    return (
        <>
            <h3>Skapa box</h3>
            {error.length !== 0 &&
                <Alert
                    type="error"
                >
                    {error}
                </Alert>
            }
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
        </>
    )
}
