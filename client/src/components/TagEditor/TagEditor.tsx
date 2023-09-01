import React, { useCallback, useEffect, useState } from 'react';
import { Header } from 'methone';
import { StyledTagEditor, HeadTags, SubTags, Editor, Color, Row } from './style';
import axios from 'axios';
import { url } from '../../common/api';
import { ITag } from '../../types/definitions';
import { TagClickable } from '../../components/TagClickable/TagClickable';
import { Field } from '../../components/Field/Field';
import { TextArea } from '../../components/TextArea/TextArea';
import { Button } from '../Button/Button';
import { ColorRandomizer, useCalculateTextContrast, useRandomizeColor } from '../ColorRandomizer/ColorRandomizer';
import Theme from '../../common/Theme';
import { BiSwitch } from '../BiSwitch/BiSwitch';

export interface ITagEdit {
    name: string;
    description: string;
    color: string;
    backgroundColor: string;
    id?: number;
    parent?: number;
    type: "PATCH" | "ARTEFACT"
}

interface Props {
    tags: ITag[];
    selectedTag: ITag | null;
    setSelectedTag: (t: ITag) => void;
    value: ITagEdit;
    setValue: (next: ITagEdit) => void;
    onSubmit: () => void;
    onDelete: () => void;
    loading: boolean;
}

export const TagEditor: React.FC<Props> = ({ tags, selectedTag, setSelectedTag, value, setValue, onSubmit, onDelete, loading }) => {

    const [edit, setEdit] = useState(false);
    const getTextColor = useCalculateTextContrast();
    const randomizeColor = useRandomizeColor();

    const clickTag = (tag: ITag) => {
        setSelectedTag(tag)
        setEdit(false);
    }
    
    const onClickCreateNew = () => {
        const bgColor = randomizeColor();
        const textColor = getTextColor(bgColor);

        const newTag = {
            name: "",
            description: "",
            backgroundColor: bgColor,
            color: textColor,
            type: "PATCH"
        } as ITagEdit;
        
        setSelectedTag(newTag as ITag)
        setEdit(true);
    }

    const titleString = () => {
        if (selectedTag) {
            if (edit) return "Skapa ny tagg";
            else return `Redigera "${selectedTag.name}"`;
        }
    }

    const reset = useCallback(() => {
        if (selectedTag) {
            setValue({...selectedTag })
        }
    }, [selectedTag])


    return (
        <StyledTagEditor>
            <div>
                <Button label="Skapa ny tagg" onClick={onClickCreateNew}/>
            </div>
            <h3>Redigera taggar</h3>
            <HeadTags>
                {tags.filter(t => t.type === value.type).map((t: ITag) =>
                    <TagClickable
                        tag={t}
                        clicked={t.id === selectedTag?.id}
                        onClick={() => clickTag(t)}
                        key={"htag-"+t.id}
                    />
                )}
            </HeadTags>
           
            {selectedTag != null &&
                <Editor>
                    <h3>{titleString()}</h3>
                    <h4>Namn</h4>
                    <Field
                        placeholder="Namn"
                        value={value.name}
                        onChange={(e: any) => setValue({...value, name: e.target.value})}
                        disabled={loading}
                    />
                    <h4>Beskrivning</h4>
                    <Field
                        placeholder="Beskrivning"
                        value={value.description}
                        onChange={(e: any) => setValue({...value, description: e.target.value})}
                        disabled={loading}
                    />
                    <h4>Bakgrundsfärg</h4>
                    <Color>
                        <input
                            type="color"
                            value={value.backgroundColor}
                            onChange={(e: any) => {
                                const bg = e.target.value;
                                const textColor = getTextColor(bg)
                                
                                setValue({...value, color: textColor, backgroundColor: bg})}
                            }
                            disabled={loading}
                        />
                        <ColorRandomizer
                            color={value.color}
                            backgroundColor={value.backgroundColor}
                            setColors={(color: string, bg: string) => setValue({ ...value, color, backgroundColor: bg })}
                            type="background"
                            disabled={loading}
                        />
                    </Color>
                    <h4>Förhandsgranskning</h4>
                    <TagClickable tag={value as ITag} clicked={true} onClick={() => {}} />
                    <Row>
                        <Button
                            label="Radera"
                            onClick={onDelete}
                            color="#fff"
                            backgroundColor={Theme.palette.red}
                            disabled={loading || !value.id}
                        />
                        <Button
                            label="Återställ"
                            onClick={reset}
                            color=""
                            backgroundColor=""
                            disabled={loading}
                        />
                        <Button
                            label="Spara"
                            onClick={onSubmit}
                            disabled={loading}
                        />
                    </Row>
                </Editor>
            }
        </StyledTagEditor>
    )
}