import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Field } from '../../../../components/Field/Field';
import { Button } from '../../../../components/Button/Button';
import { TextArea } from '../../../../components/TextArea/TextArea';
import { Bag, IPatch, IPerson, ITag } from '../../../../types/definitions';
import { StyledEditDetails, Image, BRow, H1, H4, DeleteBox, DeleteCenter } from './style';
import axios from 'axios';
import { url } from '../../../../common/api';
import { FileUploader } from '../../../../components/FileUploader/FileUploader';
import { TagSelector } from '../../../../components/TagSelector/TagSelector';
import { CreatorHandler } from '../../../../components/CreatorHandler/CreatorHandler';
import { SpinnerCover } from '../../../../components/SpinnerCover/SpinnerCover';
import { uploadFiles } from '../../../../functions/fileUploading';
import { Alert } from '../../../../components/Alert/Alert';
import Theme from '../../../../common/Theme';

interface Props {
    onCancel: () => void;
    patch: IPatch;
    fetchPatches: () => Promise<void>;
    tags: ITag[];
    editApiPath: string;
    type: "patch" | "artefact";
    onDeleteClick: (id: number) => any;
    bags: Bag[];
}

export const EditDetails: React.FC<Props> = ({ patch, onCancel, tags, fetchPatches, editApiPath, type, onDeleteClick, bags }) => {

    const [editState, setEditState] = useState<IPatch>(patch);
    const [creators, setCreators] = useState<string[]>(patch.createdBy.map(c => `${c.id}`));
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [requestError, setRequestError] = useState("");
    const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");
    const [persons, setPersons] = useState<IPerson[]>([]);

    const [image, setImage] = useState<File | null>(null);

    const ref = useRef(document.createElement("div"));

    useEffect(() => {
        setEditState(patch);
        setFiles([])
    }, [patch])

    useEffect(() => {
        (async () => {
            const result = await axios.get(url("/api/persons/all"));
            if (result.status === 200) {
                setPersons(result.data.body);
            }
        })();
    }, []);

    const onChange = (e: any) => {
        setEditState({ ...editState, [e.target.name]: e.target.value })
    }

    const put = async () => {
        setLoading(true);
        setRequestError("");
        const body = {
            id: editState.id,
            name: editState.name,
            description: editState.description,
            date: editState.date,
            tags: editState.tags.map((x: ITag) => x.id),
            creators: creators.map(c => parseInt(c)),
            amount: parseInt(`${editState.amount}`),
        } as any

        if (image) {
            await replaceImage();
        }

        if (editState.date.length === 0) delete body.date
        axios.put(url(editApiPath), body,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
        .then(
            async res => {
                if (files.length !== 0) {
                    await uploadFiles(editState.id, files[0], type === "patch" ? "patch-files" : "artefact-files", type);
                }
                await fetchPatches();
                onCancel();
            },

        )
        .catch(err => {
            setRequestError(JSON.stringify(err.response.data))
        })
        .finally(() => {
            setLoading(false)
            ref?.current?.scrollIntoView({ behavior: "smooth" })
        })
    }

    // Replace images on a patch
    // Uploads the new image, attaches the returned images to the Patch, and deletes the old images from S3.
    const replaceImage = useCallback(async () => {
        if (type !== "patch") return;
        if (image === null) return;
        const imageFormData = new FormData();
        imageFormData.append("image", image as File);

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        };
        // Upload new image
        const uploadImageResult = await axios.post(url("/api/files/upload/image?path=patches"), imageFormData, config);
        // Attach the returned image and the compressed image to the Patch
        const result = await axios.post(url("/api/files/attach/img-to"), {
            id: editState.id,
            images: uploadImageResult.data.body.map((b: any) => b.Location),
            type: "patch",
        }, config);

        if (result.status !== 200) return;
        // Delete old images from S3
        editState.images.map(async i => {
            // i is a complete url, we need the key which is extracted from the pathname
            // Remove the first "/" from the pathname: what remains is the key of the object
            const u = new URL(i).pathname.substring(1);
            await axios.delete(url(`/api/files/image?key=${u}`), config);
        });
    }, [image, editState.id])

    return (
        <StyledEditDetails ref={ref}>
            {loading &&
                <SpinnerCover />
            }
            {requestError &&
                <Alert type="error">
                    {requestError}
                </Alert>
            }
            <H1>Redigera "{patch.name}"</H1>
            <Image src={editState.images[1]} alt="Bild på märket" draggable={false} />
            {patch.images.map((i: string) =>
                <div key={"imagelink" + i}>
                    <a href={i} target="_blank" rel="noopener noreferrer">{i}</a>
                </div>
            )}
            {type === "patch" &&
                <FileUploader
                    files={image ? [image] : []}
                    onAddFile={(file: File) => setImage(file)}
                    onFileRemove={() => setImage(null)}
                    label="Ersätt bild"
                    accept={["png", "jpg"]}
                />
            }
            <H4>Namn</H4>
            <Field
                name="name"
                placeholder="Namn"
                value={editState.name}
                onChange={onChange}
                disabled={loading}
            />
            <H4>Datum</H4>
            <Field
                name="date"
                type="date"
                value={editState.date}
                onChange={onChange}
                disabled={loading}
            />
            <H4>Beskrivning</H4>
            <TextArea
                name="description"
                placeholder="Beskrivning"
                value={editState.description}
                onChange={onChange}
                resize="vertical"
                width="100%"
                disabled={loading}
            />
            <H4>Taggar</H4>
            <TagSelector
                tags={tags}
                selectedTags={editState.tags}
                setSelectedTags={(next: ITag[]) => setEditState({ ...editState, tags: next })}
                disabled={loading}
                query=""
            />
            <H4>Skapare</H4>
            <CreatorHandler
                data={persons}
                disabled={loading}
                onCreate={async (query) => {
                    const result = await axios.post(url("/api/persons/person"), {
                        name: query,
                    });
                    setPersons([...persons, result.data.body])
                    return result.data.body;
                }}
                selected={creators}
                setSelected={setCreators}
            />
            <H4>Ladda upp filer</H4>
            <FileUploader
                files={files}
                onAddFile={(f: File) => setFiles([f])}
                onFileRemove={(f: File) => setFiles([])}
                disabled={loading}
            />

            <H4>Antal i arkivet</H4>
            <input
                type="number"
                value={editState.amount}
                name="amount"
                onChange={onChange}
                disabled={loading}
                min={0}
            />
            <BRow>
                <Button
                    label="Tillbaka"
                    onClick={onCancel}
                    color=""
                    backgroundColor=""
                    disabled={loading}
                />
                <Button
                    label="Återställ"
                    onClick={() => setEditState(patch)}
                    color=""
                    backgroundColor=""
                    disabled={patch === editState || loading}
                />
                <Button
                    label="Spara"
                    onClick={put}
                    disabled={loading || (patch === editState && files.length === 0 && image === null && JSON.stringify(creators) == JSON.stringify(editState.createdBy.map(c => `${c.id}`)))}
                    isLoading={loading}
                />
            </BRow>
            <h4>Farliga grejer</h4>
            <DeleteBox>
                <h4 style={{ color: Theme.palette.red }}><b>Radera märket</b></h4>
                <p>Detta kan inte ångras. Skriv "<b>Radera permanent</b>" nedan för att bekräfta borttagning.</p>
                <Field
                    value={deleteConfirmation}
                    placeholder="Radera permanent"
                    onChange={e => setDeleteConfirmation(e.target.value)}
                />
                <DeleteCenter>
                    <Button
                        label="Radera"
                        onClick={() => onDeleteClick(patch.id)}
                        color="white"
                        backgroundColor={Theme.palette.red}
                        disabled={deleteConfirmation !== "Radera permanent"}
                    />
                </DeleteCenter>
            </DeleteBox>
        </StyledEditDetails>
    )
}
