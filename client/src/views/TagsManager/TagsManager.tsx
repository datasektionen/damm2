import React, { useEffect, useRef, useState } from 'react';
import { Header } from 'methone';
import { StyledTagManager, Content } from './style';
import axios from 'axios';
import { url } from '../../common/api';
import { ITag } from '../../types/definitions';
import { TagEditor, ITagEdit } from '../../components/TagEditor/TagEditor';
import { SpinnerCover } from '../../components/SpinnerCover/SpinnerCover';
import { Alert } from '../../components/Alert/Alert';
import Helmet from 'react-helmet';
import { title } from '../../common/strings';

interface Props {

}

const defaultFormValue: ITagEdit = {
    name: "",
    description: "",
    color: "",
    backgroundColor: "",
    type: "PATCH",
}

export const TagsManager: React.FC<Props> = ({}) => {

    const [tags, setTags] = useState<ITag[]>([]);
    const [selectedTag, setSelectedTag] = useState<ITag | null>(null);
    const [form, setForm] = useState<ITagEdit>(defaultFormValue)
    const [loading, setLoading] = useState<boolean>(true);
    const [requestError, setRequestError] = useState("");
    const [success, setSuccess] = useState<string>("");
    const ref = useRef(document.createElement("div"));

    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    }

    const fetchTags = async () => {
        const result = await axios.get(url("/api/tags/all"))
        if (result.status === 200) {
            setTags(result.data.body)
            setLoading(false)
            setSelectedTag(null)
            setForm(defaultFormValue)
        }
        // TODO: Handle error
    }

    useEffect(() => {
        (async () => {
            await fetchTags()
        })()
    }, [])

    const clickTag = (t: ITag) => {
        setSelectedTag(t)
    }

    useEffect(() => {
        setForm(selectedTag ? selectedTag : {...defaultFormValue, type: 'PATCH' })
    }, [selectedTag])

    const submit = async () => {
        setLoading(true)
        setRequestError("")
        setSuccess("")

        // Update
        if (form.id) {
            axios.put(url("/api/tags/update"), form, axiosConfig)
            .then(async res => {
                await fetchTags();
                setSuccess("Taggen sparades")
            })
            .catch(err => {
                setRequestError(JSON.stringify(err.response.data))
            })
            .finally(() => {
                ref?.current?.scrollIntoView()
                setLoading(false)
            })
        } else { // Create new
            axios.post(url("/api/tags/create"), form, axiosConfig)
            .then(async res => {
                await fetchTags()
                setSuccess("Taggen sparades")
            })
            .catch(err => {
                setRequestError(JSON.stringify(err.response.data))
            })
            .finally(() => {
                ref?.current?.scrollIntoView()
                setLoading(false)
            })
        }
    }

    const deleteTag = async () => {
        setLoading(true)
        axios.delete(url(`/api/tags/${form.id}`), axiosConfig)
        .then(async res => {
            setLoading(false)
            setSuccess("Taggen togs bort")
            await fetchTags()
            ref?.current?.scrollIntoView()
        })
        .catch((err) => {

        })
    }

    return (
        <div ref={ref}>
            <Helmet>
                <title>{title("Hantera taggar")}</title>
            </Helmet>
            <StyledTagManager>
                {loading && <SpinnerCover />}
                <Content>
                    {requestError &&
                        <Alert type="error">
                            {requestError}
                        </Alert>
                    }
                    {success &&
                        <Alert type="success">
                            {success}
                        </Alert>
                    }
                    <TagEditor
                        tags={tags}
                        selectedTag={selectedTag}
                        setSelectedTag={clickTag}
                        value={form}
                        setValue={(next: ITagEdit) => setForm(next)}
                        onSubmit={submit}
                        onDelete={deleteTag}
                        loading={loading}
                    />
                </Content>
            </StyledTagManager>
        </div>
    )
}