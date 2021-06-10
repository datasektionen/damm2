import React, { useEffect, useState } from 'react';
import { ITag } from '../../../../types/definitions';
import { StyledFilterAndSort, Row, ButtonRow, Expander } from './style';
import { Button } from '../../../../components/Button/Button';
import { Search } from '../../../../components/Search/Search';
import { Selector } from '../../../../components/Selector/Selector';
import { PATCH_SORT_MODES } from '../../PatchArhive';
import { TagSelector } from '../../../../components/TagSelector/TagSelector';

interface Props {
    numberOfPatches: number;
    patchQuery: string;
    setPatchQuery: (value: string) => void;
    sortOption: string;
    setSortOption: (value: string) => void;
    selectedTags: ITag[];
    setSelectedTags: (next: any) => void;
    tags: ITag[];
}

export const FilterAndSort: React.FC<Props> = props => {

    const { patchQuery, setPatchQuery, sortOption, setSortOption, selectedTags, setSelectedTags, tags } = props;

    const [filteredTags, setFilteredTags] = useState<ITag[]>([]);
    const [tagsExpanded, setTagsExpanded] = useState(true);
    const [tagFilter, setTagFilter] = useState("");

    const sortOptions = [
        { groupLabel: "Namn", values: [{key: PATCH_SORT_MODES.AÖ, label: "A-Ö"}, {key: PATCH_SORT_MODES.ÖA, label: "Ö-A"}] },
        { groupLabel: "Datum", values: [{key: PATCH_SORT_MODES['1983nu'], label: "1983-nu"}, {key: PATCH_SORT_MODES.nu1983, label: "Nu-1983"}] },
        { groupLabel: "Uppladdningsdatum", values: [{key: PATCH_SORT_MODES.oldnew, label: "Äldst-nyast"}, {key: PATCH_SORT_MODES.newold, label: "Nyast-äldst"}] },
    ]

    const clearAll = () => {
        setSelectedTags([]);
        setPatchQuery("");
        setTagFilter("");
    }

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
                <TagSelector
                    tags={tags}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                />
            </div>
        </StyledFilterAndSort>
    )
}