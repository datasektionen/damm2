import React, { useEffect, useMemo, useState } from 'react';
import { H3, H4, Content, StyledPatchCreator, BRow, StyledRequired, ImagePreview, Row } from './style';
import { Header } from 'methone';
import { Field } from '../../components/Field/Field';
import { TextArea } from '../../components/TextArea/TextArea';
import axios from 'axios';
import { url } from '../../common/api';
import { ITag } from '../../types/definitions';
import { Button } from '../../components/Button/Button';
import { FileUploader } from '../../components/FileUploader/FileUploader';
import { TagSelector } from '../../components/TagSelector/TagSelector';
import { CreatorHandler } from '../../components/CreatorHandler/CreatorHandler';
import { Alert } from '../../components/Alert/Alert';
import { SpinnerCover } from '../../components/SpinnerCover/SpinnerCover';
import { uploadFiles } from '../../functions/fileUploading';
import Helmet from 'react-helmet';
import { title } from '../../common/strings';

const Required: React.FC = props =>
    <StyledRequired>
        *
    </StyledRequired>

interface Props {

}

interface Form {
    name: string;
    description: string;
    date: string;
    tags: ITag[];
}

const defaultForm: Form = {
    name: "",
    description: "",
    date: "",
    tags: [],
}

export const ArtefactCreator: React.FC<Props> = props => {

    const [allTags, setAllTags] = useState<ITag[]>([]);
    const [form, setForm] = useState<Form>(defaultForm);
    const [valid, setValid] = useState<boolean>(false);
    const [creator, setCreator] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        (async () => {
            setLoading(true)
            const result = await axios.get(url("/api/tags/all?type=ARTEFACT"))
            if (result.status === 200) {
                setAllTags(result.data.body);
                setLoading(false)
            }
            // TODO Handle error
        })()
    }, []);

    const onChange = (e: any) => {
        const name = e.target.name;
        const value = e.target.value;

        setForm({...form, [name]: value})
    }

    const onAddImage = (image: File) => {
        setImage(image);
    }

    const onClearImage = () => {
        setImage(null);
    }

    const scrollTop = () => window.scrollTo({ behavior: "smooth", top: 0 });

    const clear = () => {
        setForm(defaultForm);
        setCreator("");
        setFiles([]);
        setImage(null);
        scrollTop();
    }

    const clearAlerts = () => {
        setError("");
        setSuccess(false)
    }

    const post = async () => {
        setLoading(true);
        clearAlerts();
        const body = {
            name: form.name,
            description: form.description,
            tags: form.tags.map((t: ITag) => t.id),
        } as any;

        if (form.date.length !== 0) body.date = form.date;

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }

        let createPatchResult;
        try {
            createPatchResult = await axios.post(url("/api/artefacts/create"), body, config)
            if (createPatchResult.status !== 200) {
            }

            const imageFormData = new FormData();
            imageFormData.append("image", image as File);
    
            const uploadImageResult = await axios.post(url("/api/files/upload/image?path=artefacts"), imageFormData, config)
    
            await axios.post(url("/api/files/attach/img-to"), {
                id: createPatchResult.data.body.id,
                images: uploadImageResult.data.body.map((b: any) => b.Location),
                type: "artefact",
            }, config)
            
        } catch (err: any) {
            scrollTop();
            setLoading(false);
            setError(err.toString());
            return;
        }

        if (files.length !== 0) {

            try {
                await uploadFiles(createPatchResult.data.body.id, files[0], "artefact-files", "artefact");
            } catch (err) {
                scrollTop();
                setLoading(false);
                setSuccess(true);
                setError("Misslyckades att ladda upp bifogade filer.");
                clear();
                return;
            }
        }

        setLoading(false);
        setSuccess(true);
        clear();
    }

    useEffect(() => {
        let valid = true;
        if (form.name.length === 0) valid = false;
        if (image === null) valid = false;
        setValid(valid)
    }, [form, image])

    const patchPreview = useMemo(() => {
        if (image !== null) {
            return URL.createObjectURL(image);
        }
        return "";
    }, [image])

    return (
        <>
            <Helmet>
                <title>{title("Skapa märke")}</title>
            </Helmet>
            <StyledPatchCreator>
                {loading &&
                    <SpinnerCover />
                }
                <Content>
                    {success &&
                        <Alert type="success">
                            Föremålet skapades
                        </Alert>
                    }
                    {error &&
                        <Alert type="error">
                            {error}
                        </Alert>
                    }
                    <p>Skapa ett föremål till museet</p>
                    <H3>Bild <Required /></H3>
                    <H4>Ladda upp en högupplöst bild på föremålet. En komprimerad version genereras av servern och visas som tumnagel i arkivet. Inte förrän man klickar på föremålet syns den högupplösta versionen</H4>
                    {image &&
                        <Row>
                            <ImagePreview src={patchPreview} draggable={false} />
                        </Row>
                    }
                    <FileUploader
                        label="Ladda upp en bild på föremålet"
                        files={image ? [image] : []}
                        onAddFile={onAddImage}
                        onFileRemove={onClearImage}
                        accept={["png", "jpg"]}
                        disabled={loading}
                    />
                    <H3>Namn <Required /></H3>
                    <H4>Ange ett namn på föremålet</H4>
                    <Field
                        name="name"
                        placeholder="Namn"
                        value={form.name}
                        onChange={onChange}
                        disabled={loading}
                    />
                    <H3>Beskrivning</H3>
                    <H4>Beskriv föremålets bakgrund, historia eller något annat roligt (föremålets "lore" med andra ord)</H4>
                    <TextArea
                        name="description"
                        placeholder="Beskrivning"
                        value={form.description}
                        onChange={onChange}
                        disabled={loading}
                    />
                    <H3>Datum</H3>
                    <H4>Datum som föremålet släpptes, lämna tomt om okänt</H4>
                    <Field
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={onChange}
                        disabled={loading}
                    />
                    <H3>Taggar</H3>
                    <H4>Lägg till taggar för enklare filtrering och sökning</H4>
                    <TagSelector
                        tags={allTags}
                        selectedTags={form.tags}
                        setSelectedTags={(next: ITag[]) => setForm({...form, tags: next})}
                        disabled={loading}
                        query=""
                    />
                    <H3>Filer</H3>
                    <H4>Lägg upp tillhörande filer</H4>
                    <H4><b>NOTERA!!!! Filer som laddas upp på artefakter är publika, till skillnad från filer på märken, som bara admin kan se.</b></H4>
                    <FileUploader
                        files={files}
                        onAddFile={(file: File) => setFiles([file])}
                        onFileRemove={(file: File) => setFiles([])}
                        multiple={true}
                        label="Går bara att ladda upp en i taget. Lägg upp fler i redigeringsvyn."
                    />
                    <BRow>
                        <Button
                            label="Återställ"
                            onClick={clear}
                            color=""
                            backgroundColor=""
                            disabled={loading}
                        />
                        <Button
                            label="Skapa"
                            onClick={post}
                            disabled={loading || !valid}
                            isLoading={loading}
                        />
                    </BRow>
                </Content>
            </StyledPatchCreator>
        </>
    )
}
