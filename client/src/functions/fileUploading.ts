import axios from "axios";
import { url } from "../common/api";



export const uploadFiles = async (id: number, files: File, type: "patch" | "artefact" = "patch") => {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    }

    const formData = new FormData();
    formData.append("file", files);

    const uploadResult = await axios.post(url(`/api/files/upload/${type}-file`), formData, config);
    return await axios.post(url("/api/files/attach/file-to"), {
        id,
        file: uploadResult.data.body.Key,
        type: type
    }, config);
}