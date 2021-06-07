import React, { useEffect, useState } from 'react';
import { ITag } from '../../../../types/definitions';
import { StyledFilterAndSort, Row, ButtonRow, Expander, Tags, StyledFlipMove } from './style';
import { Button } from '../../../../components/Button/Button';
import { Search } from '../../../../components/Search/Search';
import { Selector } from '../../../../components/Selector/Selector';
import { TagClickable } from '../../../../components/TagClickable/TagClickable';
import axios from 'axios';
import { url } from '../../../../common/api';
import { PATCH_SORT_MODES } from '../../PatchArhive';

interface Props {
    numberOfPatches: number;
    patchQuery: string;
    setPatchQuery: (value: string) => void;
    sortOption: string;
    setSortOption: (value: string) => void;
    selectedTags: ITag[];
    setSelectedTags: (next: any) => void;
}

export const FilterAndSort: React.FC<Props> = props => {

    const { patchQuery, setPatchQuery, sortOption, setSortOption, selectedTags, setSelectedTags } = props;

    const [tags, setTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    const [tagsExpanded, setTagsExpanded] = useState(true);
    const [tagFilter, setTagFilter] = useState("");

    const sortOptions = [
        { groupLabel: "Namn", values: [{key: PATCH_SORT_MODES.AÖ, label: "A-Ö"}, {key: PATCH_SORT_MODES.ÖA, label: "Ö-A"}] },
        { groupLabel: "Datum", values: [{key: PATCH_SORT_MODES['1983nu'], label: "1983-nu"}, {key: PATCH_SORT_MODES.nu1983, label: "Nu-1983"}] },
        { groupLabel: "Uppladdningsdatum", values: [{key: PATCH_SORT_MODES.oldnew, label: "Äldst-nyast"}, {key: PATCH_SORT_MODES.newold, label: "Nyast-äldst"}] },
    ]

    const toggleTag = (tag: ITag) => {
        // Tag is not in list, add it
        if (selectedTags.filter((t: ITag) => t.id === tag.id).length === 0) {
            setSelectedTags(selectedTags.concat(tag as any));
        } else { // Remove it
            setSelectedTags(selectedTags.filter((t: ITag) => t.id !== tag.id));
        }
    }

    const isTagClicked = (tag: ITag) => {
        return selectedTags.filter((t: ITag) => tag.id === t.id).length === 0 ? false : true
    }

    const clearAll = () => {
        setSelectedTags([]);
        setPatchQuery("");
        setTagFilter("");
    }

    useEffect(() => {
        (async () => {
            const response = await axios.get(url("/api/tags/all"));
            if (response.status !== 200) {
                // TODO
                return;
            }

            setTags(response.data.body);
        })()

    }, []);

    useEffect(() => {
        setFilteredTags(tags.filter((t: ITag) => t.name.toLowerCase().match(new RegExp(tagFilter.toLowerCase(), "g")) !== null));
    }, [tagFilter, tags])

    const toggleExpander = () => {
        setTagsExpanded(!tagsExpanded);
        setTagFilter("");
    }

    return (
        <StyledFilterAndSort>
            <h3>Sök bland {props.numberOfPatches} märken</h3>
            <ButtonRow>
                <Button label="Rensa filter" onClick={() => clearAll()}/>
                <Button label="Avmarkera taggar" onClick={() => setSelectedTags([])}/>
            </ButtonRow>
            <Row>
                <Search
                    placeholder="Sök på märken eller skapare"
                    value={patchQuery}
                    onClear={() => setPatchQuery("")}
                    onChange={(e: any) => setPatchQuery(e.target.value)}
                />
                <Selector
                    values={sortOptions}
                    onChange={(e: any) => setSortOption(e.target.value)}
                    value={sortOption}
                />
            </Row>
            <Expander onClick={toggleExpander} expanded={tagsExpanded}>
                Taggar
                <i className="fas fa-arrow-down" />
            </Expander>
            <div style={tagsExpanded ? {display: "flex", flexDirection: "column", alignItems: "center"} : {display: "none"}}>
                <Search
                    placeholder="Filtrera taggar"
                    value={tagFilter}
                    onClear={() => setTagFilter("")}
                    onChange={(e: any) => setTagFilter(e.target.value)}
                />
                <Tags>
                    {tags.length === 0 ?
                        "Hittade inga taggar"
                        :
                        filteredTags.map((t: ITag, i) =>
                            <TagClickable
                                key={"filter-tags-"+t.id}
                                tag={t}
                                clicked={isTagClicked(t)}
                                onClick={() => toggleTag(t)}
                            />
                        )
                    }
                </Tags>
            </div>
        </StyledFilterAndSort>
    )
}