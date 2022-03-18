import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ITag } from '../../../../types/definitions';
import { StyledFilterAndSort, Row, ButtonRow, Expander, Tags } from './style';
import { Button } from '../../../../components/Button/Button';
import { Search } from '../../../../components/Search/Search';
import { Selector } from '../../../../components/Selector/Selector';
import { PATCH_SORT_MODES } from '../../PatchArchive';
import { TagSelector } from '../../../../components/TagSelector/TagSelector';

interface Props {
    patchQuery: string;
    setPatchQuery: (value: string) => void;
    sortOption: string;
    setSortOption: (value: string) => void;
    selectedTags: ITag[];
    setSelectedTags: (next: any) => void;
    tags: ITag[];
    label: string;
    gotoFirstPage: () => void;
}

export const FilterAndSort: React.FC<Props> = props => {

    const { patchQuery, setPatchQuery, sortOption, setSortOption, selectedTags, setSelectedTags, tags, label, gotoFirstPage } = props;

    const [tagsExpanded, setTagsExpanded] = useState(true);
    const [tagFilter, setTagFilter] = useState("");

    const sortOptions = useMemo(() => {
        const groupLabels = Array.from(new Set(PATCH_SORT_MODES.map(x => x.groupLabel)));

        return groupLabels.map(l => {
            return {
                groupLabel: l,
                values: PATCH_SORT_MODES.filter(x => x.groupLabel === l).map(x => { return { key: x.key, label: x.label } })
            }
        })
    }, []);

    const clearAll = () => {
        setSelectedTags([]);
        setPatchQuery("");
        setTagFilter("");
        setSortOption(PATCH_SORT_MODES.find(x => x.default)?.key!)
    }

    const toggleExpander = () => {
        setTagsExpanded(!tagsExpanded);
        setTagFilter("");
    }

    const onSearch = useCallback((e: any) => {
        gotoFirstPage();
        setPatchQuery(e.target.value)
    }, [setPatchQuery, gotoFirstPage])

    const onSearchClear = useCallback(() => {
        gotoFirstPage();
        setPatchQuery("")
    }, [setPatchQuery, gotoFirstPage])

    const onSortOptionChange = useCallback((e: any) => {
        gotoFirstPage();
        setSortOption(e.target.value)
    }, [setSortOption, gotoFirstPage])

    return (
        <StyledFilterAndSort>
            <h3>{label}</h3>
            <ButtonRow>
                <Button label="Rensa filter" onClick={() => clearAll()}/>
                <Button label="Avmarkera taggar" onClick={() => setSelectedTags([])}/>
            </ButtonRow>
            <Row>
                <Search
                    placeholder="Sök på märken eller skapare"
                    value={patchQuery}
                    onClear={onSearchClear}
                    onChange={onSearch}
                />
                <Selector
                    values={sortOptions}
                    onChange={onSortOptionChange}
                    value={sortOption}
                />
            </Row>
            <Expander onClick={toggleExpander} expanded={tagsExpanded}>
                Taggar
                <i className="fas fa-chevron-down" />
            </Expander>
            <Tags expanded={tagsExpanded}>
                <Search
                    placeholder="Filtrera taggar"
                    value={tagFilter}
                    onClear={() => setTagFilter("")}
                    onChange={(e: any) => setTagFilter(e.target.value)}
                />
                <TagSelector
                    tags={tags}
                    selectedTags={selectedTags}
                    setSelectedTags={next => {
                        gotoFirstPage();
                        setSelectedTags(next);
                    }}
                    query={tagFilter}
                />
            </Tags>
        </StyledFilterAndSort>
    )
}
