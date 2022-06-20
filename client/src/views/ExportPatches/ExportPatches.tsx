import axios from "axios"
import { Button } from "../../components/Button/Button"

export const ExportPatches = () => {

    const exportData = () => {
        axios.get("/api/storage/export", {
            responseType: "blob"
        })
        .then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "export.csv");
            document.body.appendChild(link);
            link.click();
        })
    }

    return (
        <>
            <p>Klicka nedan för att exportera alla märken som en CSV-fil.</p>
            <Button
                label="Exportera"
                onClick={exportData}
            />
        </>
    )
}
