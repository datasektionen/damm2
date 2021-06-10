import React from 'react';
import { ITag } from '../../types/definitions';
import { TagClickable } from '../TagClickable/TagClickable';
import { StyledTagSelector } from './style';

interface Props {
    tags: ITag[];
    selectedTags: ITag[];
    setSelectedTags: (next: ITag[]) => void;
    disabled?: boolean;
}

export const TagSelector: React.FC<Props> = ({tags, selectedTags, setSelectedTags, disabled}) => {

    const toggleTag = (tag: ITag) => {
        if (disabled) return;
        // Tag is not in list, add it
        if (selectedTags.filter((t: ITag) => t.id === tag.id).length === 0) {
            setSelectedTags(selectedTags.concat(tag))
        } else { // Remove it
            setSelectedTags(selectedTags.filter((t: ITag) => t. id !== tag.id))
        }
    }

    return (
        <StyledTagSelector>
            {tags.map(t => 
                <TagClickable
                    tag={t}
                    clicked={selectedTags.filter((x: ITag) => x.id === t.id).length !== 0}
                    onClick={() => toggleTag(t)}
                    key={"tag-"+t.id}
                    disabled={disabled}
                />
            )}
        </StyledTagSelector>
    )
}