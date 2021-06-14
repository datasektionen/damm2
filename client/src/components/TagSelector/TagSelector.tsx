import React, { useEffect, useState } from 'react';
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
            // If we clicked on head tag, remove children of head tag
            // Don't ask me what this code does, wrote this a long time ago and I don't understand
            for (const t of nextSelectedTags) {
                (tag.children ?? []).forEach((c, i) => {
                    if (c.id === t.id) nextSelectedTags = nextSelectedTags.filter(x => x !== c)
                })
            }
            setSelectedTags(nextSelectedTags)
        }
    }

    useEffect(() => {
        setFilteredTags(tags.filter((t: ITag) => t.name.toLowerCase().match(new RegExp(query.toLowerCase(), "g")) !== null));
    }, [query, tags])

    // Merge array of arrays into one array
    // https://stackoverflow.com/a/10865042
    const subTags =
        [].concat.apply(
            [],
            selectedTags
            .map(x =>
                x.children ?? []
            ) as any
        )
        // Filter tags from search query
        .filter((t: ITag) => t.name.toLowerCase().match(new RegExp(query.toLowerCase(), "g")) !== null)

    return (
        <StyledTagSelector>
            {filteredTags.length === 0 &&
                <StyledFlipMove enterAnimation="fade" leaveAnimation="fade" appearAnimation="fade" duration={250} >
                    <span key="notags">Inga taggar</span>
                </StyledFlipMove>
            }
            {filteredTags.length !== 0 &&
                <StyledFlipMove enterAnimation="fade" leaveAnimation="fade" appearAnimation="fade" duration={250} >
                    {
                        filteredTags
                        .filter(t => t.tagId === null)
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
            }
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
            }
        </StyledTagSelector>
    )
}