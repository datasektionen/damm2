import React, { useEffect, useRef, useState } from 'react';
import { Field } from '../../../../components/Field/Field';
import { Button } from '../../../../components/Button/Button';
import { TextArea } from '../../../../components/TextArea/TextArea';
import { IPatch, ITag } from '../../../../types/definitions';
import { StyledEditDetails, Image, BRow, H1, H4 } from './style';
import axios from 'axios';
import { url } from '../../../../common/api';
import { FileUploader } from '../../../../components/FileUploader/FileUploader';
import { TagSelector } from '../../../../components/TagSelector/TagSelector';
import { CreatorHandler } from '../../../../components/CreatorHandler/CreatorHandler';
import { SpinnerCover } from '../../../../components/SpinnerCover/SpinnerCover';
import { uploadFiles } from '../../../../functions/fileUploading';
import { Alert } from '../../../../components/Alert/Alert';

interface Props {
    onCancel: () => void;
    patch: IPatch;
    fetchPatches: () => Promise<void>;
    tags: ITag[];
}

export const EditDetails: React.FC<Props> = ({patch, onCancel, tags, fetchPatches}) => {

    const [editState, setEditState] = useState<IPatch>(patch);
    const [creator, setCreator] = useState("");
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [requestError, setRequestError] = useState("");

    const ref = useRef(document.createElement("div"));

    useEffect(() => {
        setEditState(patch);
        setFiles([])
    }, [patch])

    const onChange = (e: any) => {
        setEditState({...editState, [e.target.name]: e.target.value})
    }

    const put = () => {
        setLoading(true);
        setRequestError("");
        axios.put(url("/api/patches/update"), {
            patchId: editState.id,
            name: editState.name,
            description: editState.description,
            date: editState.date,
            tags: editState.tags.map((x: ITag) => x.id),
            creators: editState.creators,
        },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
        .then(
            async res => {
                if (files.length !== 0) {
                    await uploadFiles(editState.id, files[0]);
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
            ref?.current?.scrollIntoView({behavior: "smooth"})
        })
    }

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
                <div key={"imagelink"+i}>
                    <a href={i} target="_blank" rel="noopener noreferrer">{i}</a>
                </div>
            )}
            <H4>Namn</H4>
            <Field
                name="name"
                placeholder="Namn"
                value={editState.name}
                onChange={onChange}
                disabled={loading}
            />
            <H4>Datum</H4>
            <input
                name="date"
                type="date"
                style={{height: "50px", padding: "10px"}}
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
                creator={creator}
                setCreator={(value: string) => setCreator(value)}
                creators={editState.creators}
                setCreators={(next: string[]) => setEditState({ ...editState, creators: next })}
                disabled={loading}
            />
            <H4>Ladda upp filer</H4>
            <FileUploader
                files={files}
                onAddFile={(f: File) => setFiles([f])}
                onFileRemove={(f: File) => setFiles([])}
                disabled={loading}
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
                    disabled={loading || (patch === editState && files.length === 0)}
                    isLoading={loading}
                />
            </BRow>
        </StyledEditDetails>
    )
}