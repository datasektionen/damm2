import React, { useEffect, useState } from 'react';
import { Header } from 'methone';
import { StyledTagEditor, HeadTags, SubTags, Editor, Color, Row } from './style';
import axios from 'axios';
import { url } from '../../common/api';
import { ITag } from '../../types/definitions';
import { TagClickable } from '../../components/TagClickable/TagClickable';
import { Field } from '../../components/Field/Field';
import { TextArea } from '../../components/TextArea/TextArea';
import { Button } from '../Button/Button';
import { ColorRandomizer } from '../ColorRandomizer/ColorRandomizer';
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
    selectedTags: ITag[];
    setSelectedTags: (t: ITag[]) => void;
    value: ITagEdit;
    setValue: (next: ITagEdit) => void;
    onSubmit: () => void;
    onDelete: () => void;
    loading: boolean;
}

export const TagEditor: React.FC<Props> = ({ tags, selectedTags, setSelectedTags, value, setValue, onSubmit, onDelete, loading }) => {

    const [edit, setEdit] = useState(false);

    const clickTag = (tag: ITag) => {
        if (selectedTags.length === 0) {
            setSelectedTags([tag]);
        } else if (selectedTags.length === 1) {
            const headTag = selectedTags[0];
            if (headTag.children.includes(tag)) setSelectedTags([headTag, tag])
            else if (tag === headTag) setSelectedTags([])
            else setSelectedTags([tag])
        } else if (selectedTags.length === 2) {
            const headTag = selectedTags[0];
            const subTag = selectedTags[1];
            if (tag === headTag) setSelectedTags([]);
            else if (tag === subTag) setSelectedTags([headTag]);
            else if (headTag.children.includes(tag)) setSelectedTags([headTag, tag])
            else setSelectedTags([tag])
        }
        setEdit(false);
    }
    
    const onClickCreateNew = (type: "head" | "sub") => {
        const newTag = {
            name: "",
            description: "",
            backgroundColor: "#E83D84",
            color: "#FFF",
            children: [] as ITag[],
            type: value.type
        } as ITagEdit;
        
        if (type === "head") {
            setSelectedTags([newTag as ITag])
        } else {
            newTag.parent = selectedTags[0].id
            setSelectedTags([selectedTags[0], newTag as ITag])
        }
        setEdit(true);
    }

    const titleString = () => {
        if (selectedTags.length === 1) {
            if (edit) return "Skapa ny huvudtagg";
            else return `Redigera "${selectedTags[0].name}"`;
        }
        else {
            if (edit) return `Skapa ny undertagg till "${selectedTags[0].name}"`;
            else return `Redigera "${selectedTags[1].name}"`;
        }
    }

    const reset = () => {
        const selected = selectedTags.length === 2 ? selectedTags[1] : selectedTags[0]
        setValue({...selected})
    }

    const changeType = () => {
        setValue({...value, type: value.type === "PATCH" ? "ARTEFACT" : "PATCH"})
        setSelectedTags([])
    }

    return (
        <StyledTagEditor>
            <h3>Taggtyp</h3>
            <BiSwitch
                left={{label: "Märke", key:"PATCH"}}
                right={{label: "Artefakt", key:"ARTEFACT"}}
                value={value.type}
                setValue={changeType}
            />
            <h3>Huvudtaggar</h3>
            <HeadTags>
                {tags.filter((t: any) => t.tagId === null).filter(t => t.type === value.type).map((t: ITag) =>
                    <TagClickable
                        tag={t}
                        clicked={t === selectedTags[0]}
                        onClick={() => clickTag(t)}
                        key={"htag-"+t.id}
                    />
                )}
                <Button label="Skapa ny" onClick={() => onClickCreateNew("head")}/>
            </HeadTags>
            <h3>Undertaggar</h3>
            <SubTags>
                {selectedTags[0]?.children.length !== 0 &&
                    selectedTags[0]?.children.map((t: ITag) =>
                        <TagClickable
                            tag={t}
                            clicked={t === selectedTags[1]}
                            onClick={() => clickTag(t)}
                            key={"stag-"+t.id}
                        />
                    )
                }
                {(selectedTags.length !== 0 && !edit) &&
                    <Button label="Skapa ny" onClick={() => onClickCreateNew("sub")} />
                }
            </SubTags>
            {selectedTags.length !== 0 &&
                <Editor>
                    <h4>Förhandsgranskning</h4>
                    <TagClickable tag={value as ITag} clicked={true} onClick={() => {}} />
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
                    <h4>Textfärg</h4>
                    <Color>
                        <input
                            type="color"
                            value={value.color}
                            onChange={(e: any) => setValue({...value, color: e.target.value})}
                            disabled={loading}
                        />
                        <ColorRandomizer
                            color={value.color}
                            backgroundColor={value.backgroundColor}
                            setColors={(color: string, bg: string) => setValue({ ...value, color, backgroundColor: bg })}
                            type="color"
                            disabled={loading}
                        />
                    </Color>
                    <h4>Bakgrundsfärg</h4>
                    <Color>
                        <input
                            type="color"
                            value={value.backgroundColor}
                            onChange={(e: any) => setValue({...value, backgroundColor: e.target.value})}
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