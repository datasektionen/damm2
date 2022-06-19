import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { url } from "../../common/api"
import { Button } from "../../components/Button/Button"
import { Field } from "../../components/Field/Field"
import { Box } from "../../types/definitions"

export const StorageHandler = () => {
    const [boxes, setBoxes] = useState<Box[]>([]);
    const [boxName, setBoxName] = useState("");
    const [isCreatingBox, setIsCreatingBox] = useState(false);

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        }
    }

    const createBox = useCallback(async () => {
        setIsCreatingBox(true)
        axios.post(url("/api/storage/box/create"), { name: boxName }, config)
        .then(res => {
            setBoxes([...boxes, res.data.body])
            setBoxName("")
        })
        .finally(() => {
            setIsCreatingBox(false)
        })
    }, [config])

    useEffect(() => {
        axios.get(url("/api/storage/box/all"), config)
        .then(res => {
            setBoxes(res.data.body)
        })
        .finally(() => {

        })
    }, [])

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
                disabled={isCreatingBox || boxName.length === 0}
            />
            <h3>Skapa påse</h3>
            <Field
                placeholder="Namn"
            />
            <select>
                {boxes.map(b =>
                    <option key={"box-" + b.id}>{b.name}</option>
                )}
            </select>
            <Button
                label="Skapa"
                onClick={() => {}}
            />
        </>
    )
}
