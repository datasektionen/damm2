import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyledTagEditor, HeadTags, SubTags, Editor, Color, Row } from './style';
import { ITag } from '../../types/definitions';
import { TagClickable } from '../../components/TagClickable/TagClickable';
import { Field } from '../../components/Field/Field';
import { Button } from '../Button/Button';
import { ColorRandomizer, useCalculateTextContrast, useRandomizeColor } from '../ColorRandomizer/ColorRandomizer';
import Theme from '../../common/Theme';

export type ITagEdit = {
    id?: number;
} & Pick<ITag, "name" | "description" | "color" | "backgroundColor" | "type" | "category">

interface Props {
    tags: ITag[];
    selectedTag: ITag | null;
    setSelectedTag: (t: ITag | null) => void;
    value: ITagEdit;
    setValue: (next: ITagEdit) => void;
    onSubmit: () => void;
    onDelete: () => void;
    loading: boolean;
}

export const TagEditor: React.FC<Props> = ({ tags, selectedTag, setSelectedTag, value, setValue, onSubmit, onDelete, loading }) => {

    const [edit, setEdit] = useState(false);
    const [filter, setFilter] = useState<ITagEdit["category"] | "ALL">("ALL");
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
            type: "PATCH",
            category: "RECEPTION"
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


    const categories = useMemo<{ label: string; id: ITagEdit["category"]}[]>(() => ([
         { label: "Mottagning", id: "RECEPTION" },
         { label: "Nämnd", id: "COMMITTEE" },
         { label: "Event", id: "EVENT" },
         { label: "Övrigt", id: "OTHER" }
    ]), [])

    useEffect(() => {
        reset();
        setSelectedTag(null)
    }, [filter])

    const filteredTags = tags
        .filter(t => t.type === value.type)
        .filter(x => filter === "ALL" ? true : x.category === filter)

    return (
        <StyledTagEditor>
            <div>
                <Button label="Skapa ny tagg" onClick={onClickCreateNew}/>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <h3 style={{ marginRight: 12}}>Redigera taggar</h3>
                <select name="category" value={filter} onChange={(e: any) => setFilter(e.target.value)} defaultValue="ALL">
                    <option value="ALL">Visa alla</option>
                    {categories.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}
                </select>
            </div>
            <HeadTags>
                {filteredTags
                    .map((t: ITag) => (
                        <TagClickable
                            tag={t}
                            clicked={t.id === selectedTag?.id}
                            onClick={() => clickTag(t)}
                            key={"htag-"+t.id}
                        />
                    )
                )}
                {filteredTags.length === 0 && <p>Finns inga taggar med den kategorin </p>}
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
                    <h4>Taggkategori</h4>
                    <div>
                        <select name="category" value={value.category} onChange={(e: any) => setValue({...value, category: e.target.value})} >
                            {categories.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}
                        </select>
                    </div>
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