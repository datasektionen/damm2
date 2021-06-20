import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { title } from '../../common/strings';
import { StyledEventHandler, Content } from './style';
import { Header } from 'methone';
import axios from 'axios';
import { url } from '../../common/api';
import { IEvent } from '../../types/definitions';
import useSortableData from '../../hooks/useSortableData';
import { Button } from '../../components/Button/Button';
import { EventTable } from './compositions/EventTable/EventTable';
import { EventEditor } from './compositions/EventEditor/EventEditor';
import moment from 'moment';
import { Spinner } from '../../components/Spinner/Spinner';
import { Alert } from '../../components/Alert/Alert';
import { useHistory, useLocation } from 'react-router';
import queryString from 'query-string';

export interface Form {
    title: string;
    content: string;
    date: string;
    id?: number;
    type: string;
    protocol?: string;
}

const defaultForm: Form = {
    title: "",
    content: "",
    date: moment(Date.now()).format("YYYY-MM-DD"),
    type: "SM_DM",
    protocol: "",
}

export const EventHandler: React.FC = props => {

    const [events, setEvents] = useState<IEvent[]>([]);
    const [form, setForm] = useState(defaultForm);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [edit, setEdit] = useState(false);
    const [original, setOriginal] = useState(defaultForm)
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>("");
    const [error, setError] = useState<string>("");
    const location = useLocation();
    const history = useHistory();

    const { items, requestSort, sortConfig } = useSortableData(events as any[], { key: "date", direction: "desc" });

    useEffect(() => {
        (async () => {
            const result = await axios.get(url("/api/events/all"))
            if (result.status !== 200) {
                // TODO
                return;
            }
            setEvents(result.data.body.filter((e: IEvent) => e.type !== "DFUNKT"));
            setLoading(false)
        })()
    }, [])

    useEffect(() => {
        const { edit_id } = queryString.parse(location.search)
        if (edit_id) {
            if (events.length === 0) return;
            
            const event = events.filter(e => e.id === Number(edit_id))[0]
            if (!event) return

            setEdit(true)
            setOriginal(event)
            setForm(event)
        }
    }, [location, events])

    const onChange = (e: any) => {
        const name = e.target.name;
        const value = e.target.value;

        setForm({...form, [name]: value})
    }

    const onCancel = () => {
        setEdit(false)
        setForm(defaultForm)
        setOriginal(defaultForm)
        history.push({
            search: "",
        })
    }

    const onEditClick = (event: IEvent) => {
        if (deleting) return;
        setEdit(true);
        setOriginal(event)
        setForm(event)
        history.push({
            search: `?edit_id=${event.id}`,
        })
    }
    
    const onReset = () => {
        setForm(original)
    }

    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    }

    const post = async () => {
        setSuccess("")
        setError("")
        setLoading(true)
        if (form.type !== "SM_DM") delete form.protocol
        axios.post(url("/api/events/create"), form, axiosConfig)
        .then(res => {
            
            onCancel()
            setSuccess("Händelsen skapad")
            setEvents([...events, res.data.body])
        })
        .catch(err => {
            setError(JSON.stringify(err.response.data))
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const put = async () => {
        setSuccess("")
        setError("")
        setLoading(true)
        if (form.type !== "SM_DM") delete form.protocol
        axios.put(url("/api/events/update"), form, axiosConfig)
        .then(res => {
            
            onCancel()
            setSuccess("Händelsen uppdaterad")
            setEvents(events.filter(e => e.id !== form.id).concat(res.data.body))
            history.push({
                search: "",
            })
        })
        .catch(err => {
            setError(JSON.stringify(err.response.data))
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const onSave = () => {
        if (form.id) return put
        else return post
    }

    const onDeleteClick = (id: number) => {
        if (deleting) return;
        setDeleting(true)
        setSuccess("")
        setError("")
        axios.delete(url(`/api/events/${id}`), axiosConfig)
        .then(res => {
            setEvents(events.filter(e => e.id !== id));
            setSuccess("Händelsen raderad")
        })
        .catch(err => {
            setError(JSON.stringify(err.response.data))
        })
        .finally(() => {
            setDeleting(false)
        })
    }

    useEffect(() => {
        let valid = true;
        if (form.title.length === 0) valid = false;
        if (form.date.length === 0) valid = false;
        if (form.type === "SM_DM") {
            // https://stackoverflow.com/a/3809435
            const validUrl = (form.protocol ?? "").match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi))
            if (form.protocol?.length === 0 || !validUrl) valid = false
        }
        setIsValid(valid)
    }, [form])
    
    return (
        <>
            <Helmet>
                <title>{title("Hantera händelser")}</title>
            </Helmet>
            <Header title={edit ? (form.title.length === 0 ? "Titel" : form.title) : "Hantera händelser"} />
            <StyledEventHandler>
                <Content>
                    {success.length !== 0 &&
                        <Alert type="success">
                            {success}
                        </Alert>
                    }
                    {error.length !== 0 &&
                        <Alert type="error">
                            {error}
                        </Alert>
                    }
                    {!edit && !loading &&
                        <Button
                            label="Skapa ny händelse"
                            onClick={() => setEdit(true)}
                            disabled={deleting}
                        />
                    }
                    {edit &&
                        <EventEditor
                            form={form}
                            onChange={onChange}
                            onCancel={onCancel}
                            onReset={onReset}
                            loading={loading}
                            onSave={onSave}
                            valid={isValid}
                        />
                    }
                    <div>
                        {loading ?
                            <div style={{textAlign: "center"}}>
                                <Spinner />
                            </div>
                        :
                            <EventTable
                                items={items}
                                requestSort={requestSort}
                                sortConfig={sortConfig}
                                collapse={edit}
                                onEditClick={onEditClick}
                                onDelete={onDeleteClick}
                                deleting={deleting}
                            />
                        }
                    </div>
                </Content>
            </StyledEventHandler>
        </>
    )
}