import axios from "axios";
import { url } from "../common/api";



export const uploadFiles = async (patchId: number, files: File) => {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    }

    const formData = new FormData();
    formData.append("file", files);

    const uploadResult = await axios.post(url("/api/files/upload/patch-file"), formData, config);
    return await axios.post(url("/api/files/attach/file-to-patch"), {
        patchId,
        file: uploadResult.data.body.Key,
    }, config);
}