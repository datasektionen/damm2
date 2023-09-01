import React, { useEffect, useMemo, useState } from 'react';
import { ITag } from '../../types/definitions';
import { TagClickableAsClass as TagClickable } from '../TagClickable/TagClickable';
import { StyledTagSelector, StyledFlipMove } from './style';

interface Props {
    tags: ITag[];
    selectedTags: ITag[];
    query: string;
    setSelectedTags: (next: ITag[]) => void;
    disabled?: boolean;
}

export const TagSelector: React.FC<Props> = ({ tags, selectedTags, setSelectedTags, disabled, query }) => {

    const [filteredTags, setFilteredTags] = useState<ITag[]>([]);

    const toggleTag = (tag: ITag) => {
        if (disabled) return;
        // Tag is not in list, add it
        if (selectedTags.filter((t: ITag) => t.id === tag.id).length === 0) {
            setSelectedTags(selectedTags.concat(tag))
        } else {
            // Remove the tag we clicked on
            let nextSelectedTags = [...selectedTags].filter(x => x.id !== tag.id);
            setSelectedTags(nextSelectedTags)
        }
    }

    useEffect(() => {
        setFilteredTags(tags.filter((t: ITag) => t.name.toLowerCase().match(new RegExp(query.toLowerCase(), "g")) !== null));
    }, [query, tags])

    const tagSections = useMemo<{ category:  ITag["category"], label: string; }[]>(() => ([
        {
            category: "COMMITTEE",
            label: "Nämnd"
        },
        {
            category: "EVENT",
            label: "Event"
        },
        {
            category: "RECEPTION",
            label: "Mottagningen"
        },
        {
            category: "OTHER",
            label: "Övrigt"
        },
    ]), [])

    return (
        <StyledTagSelector>
            {filteredTags.length === 0 &&
                <StyledFlipMove enterAnimation="fade" leaveAnimation="fade" appearAnimation="fade" duration={250} >
                    <span key="notags">Inga taggar</span>
                </StyledFlipMove>
            }
            // TODO: Fixa så man kan kategorisera en tagg vid skapande och redigering.
            // TODO: Ta bort nullability på category-fältet hos en tagg
            // TODO: Lägg till filtrering för "saknar tagg"
            // TODO: Eventuellt dropdowns för taggkategorier.
            {tagSections.map(x => (
                <div key={x.category}>
                    <h4>{x.label}</h4>
                    {filteredTags.length !== 0 &&
                        <StyledFlipMove enterAnimation="fade" leaveAnimation="fade" appearAnimation="fade" duration={250} >
                            {
                                filteredTags
                                .filter(x => x.category === x.category)
                                .map((t: ITag) => 
                                    <TagClickable
                                        tag={t}
                                        clicked={selectedTags.filter((x: ITag) => x.id === t.id).length !== 0}
                                        onClick={() => toggleTag(t)}
                                        key={"tag-"+t.category+"-"+t.id}
                                        disabled={disabled}
                                    />
                                )
                            }
                        </StyledFlipMove>
                    }
                </div>
            ))}
            {/* <h4>Event</h4>
            {filteredTags.length !== 0 &&
                <StyledFlipMove enterAnimation="fade" leaveAnimation="fade" appearAnimation="fade" duration={250} >
                    {
                        filteredTags
                        // .filter(x => x.category === "EVENT")
                        .map((t: ITag) => 
                            <TagClickable
                                tag={t}
                                clicked={selectedTags.filter((x: ITag) => x.id === t.id).length !== 0}
                                onClick={() => toggleTag(t)}
                                key={"tag-"+t.id}
                                disabled={disabled}
                            />
                        )
                    }
                </StyledFlipMove>
            } */}
{/*             
            {subTags.length !== 0 &&
                <h4>Undertaggar</h4>
            }
            {subTags.length !== 0 &&
                <StyledFlipMove enterAnimation="fade" leaveAnimation="fade" appearAnimation="fade" duration={250}>
                    {
                        subTags
                        .map((t: ITag) =>
                            <TagClickable
                                tag={t}
                                clicked={selectedTags.filter((x: ITag) => x.id === t.id).length !== 0}
                                onClick={() => toggleTag(t)}
                                key={"tag-sub-"+t.id}
                                disabled={disabled}
                            />    
                        )
                    }
                </StyledFlipMove>
            } */}
        </StyledTagSelector>
    )
}