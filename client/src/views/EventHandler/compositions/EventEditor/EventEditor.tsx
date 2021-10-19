import React from 'react';
import { Field } from '../../../../components/Field/Field';
import { TextArea } from '../../../../components/TextArea/TextArea';
import { Selector } from '../../../../components/Selector/Selector';
import Theme from '../../../../common/Theme';
import { StyledEventEditor, Row, BRow, H4 } from './style';
import { Button } from '../../../../components/Button/Button';
import { Form } from '../../EventHandler';
import { General } from '../../../../components/Timeline/Cards/General/General';
import { SM } from '../../../../components/Timeline/Cards/SM/SM';
import { Anniversary } from '../../../../components/Timeline/Cards/Anniversary/Anniversary';
import { Cards, CardWrapper, Line, LineEnd, LineStart, TimelineBody, Year } from '../../../Timeline/style';
import moment from 'moment';
import { SpinnerCover } from '../../../../components/SpinnerCover/SpinnerCover';

interface Props {
    form: Form;
    onChange: (event: any) => void;
    onCancel: () => void;
    onReset: () => void;
    loading: boolean;
    onSave: () => () => void;
    valid: boolean;
}

export const EventEditor: React.FC<Props> = ({ onReset, form, onChange, onCancel, loading, onSave, valid }) => {
    
    const eventTypes = [
        { label: "SM/DM", key: "SM_DM", color: Theme.palette.blue },
        { label: "Generell historia", key: "GENERAL", color: Theme.palette.cerise },
        { label: "Årsdagar", key: "ANNIVERSARY", color: Theme.palette.yellow },
    ]

    const year = moment(form.date).year();

    return (
        <StyledEventEditor>
            {loading && <SpinnerCover />}
            {form.id &&
                <>
                    <H4>Id</H4>
                    <Field
                        name="id"
                        value={form.id?.toString()}
                        onChange={() => {}}
                        disabled={true}
                    />
                </>
            }
            <H4>Titel</H4>
            <Field
                name="title"
                value={form.title}
                onChange={onChange}
                placeholder="Titel"
            />
            <H4>Beskrivning</H4>
            <TextArea
                name="content"
                value={form.content}
                onChange={onChange}
                placeholder="Beskrivning av händelsen"
            />
            <H4>Datum</H4>
            <Field
                name="date"
                value={form.date}
                onChange={onChange}
                type="date"
            />
            <H4>Händelsetyp</H4>
            <Selector
                name="type"
                values={[{ groupLabel: "", values: eventTypes }]}
                onChange={onChange}
                value={form.type}
            />
            {form.type === "SM_DM" &&
                <>
                    <H4>Länk till protokoll</H4>
                    <Field
                        name="protocol"
                        value={form.protocol}
                        onChange={onChange}
                        placeholder="Länk till protokoll"
                    />
                </>
            }
            <BRow>
                <Button
                    label="Avbryt"
                    onClick={onCancel}
                    color="white" backgroundColor={Theme.palette.red}
                />
                <Button
                    label="Återställ"
                    onClick={onReset}
                    color= "" backgroundColor=""
                />
                <Button
                    label="Spara"
                    onClick={onSave()}
                    isLoading={loading}
                    disabled={!valid}
                />
            </BRow>
            <TimelineBody>
                <Year>{year}</Year>
                <Cards>
                    <LineStart />
                    <LineEnd />
                    <Line />
                    <CardWrapper index={0}>                            
                        {form.type === "GENERAL" &&
                            <General {...form} id={form.id ?? -1} index={0} onEditClick={() => {}} createdBy="" />
                        }
                        {form.type === "SM_DM" &&
                            <SM {...form} id={form.id ?? -1} index={0} protocol={form.protocol as string} onEditClick={() => {}} createdBy="" />
                        }
                        {form.type === "ANNIVERSARY" &&
                            <Anniversary {...form} id={form.id ?? -1} index={0} onEditClick={() => {}} createdBy="" />
                        }
                    </CardWrapper>
                </Cards>
            </TimelineBody>
        </StyledEventEditor>
    )
}