import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyledPatchArchive, StyledFlipMove, StyledPatchArchiveDivider, Left, Right, StyledFlipMoveDetails } from './style';
import { FancyHeader } from '../../components/FancyHeader/FancyHeader';
import axios from 'axios';
import { url } from '../../common/api';
import { Patch } from '../../components/Patch/Patch';
import { IPatch, ITag } from '../../types/definitions';
import { FilterAndSort } from './compositions/FilterAndSort/FilterAndSort';
import { WrappedPatchDetails } from './compositions/PatchDetails/PatchDetails';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../common/routes';
import { SpinnerCover } from '../../components/SpinnerCover/SpinnerCover';
import queryString from 'query-string';
import useScreenSizeChecker from '../../hooks/useScreenSizeChecker';
import Helmet from 'react-helmet';
import { title } from '../../common/strings';

const nameSort = (a: IPatch, b: IPatch) => {
    const A = a.name.toLowerCase();
    const B = b.name.toLowerCase();
    if (A < B) return -1;
    if (A > B) return 1;
    else return 0;
}

const dateSort = (a: IPatch, b: IPatch) => {
    return (a.date === "" ? 0 : new Date(a.date).getTime()) - (b.date === "" ? 0 : new Date(b.date).getTime())
}

const releaseSort = (a: IPatch, b: IPatch) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

export const PATCH_SORT_MODES: { label: string; key: string; sort: (a: IPatch, b: IPatch) => number; default?: boolean; groupLabel: string }[] = [

    { label: "A-Ö", key: "AÖ", sort: (a: IPatch, b: IPatch) => nameSort(a, b), groupLabel: "Namn" },
    { label: "Ö-A", key: "ÖA", sort: (a: IPatch, b: IPatch) => nameSort(b, a), groupLabel: "Namn" },

    { label: "Äldst-Nyast", key: "oldnew-upload", sort: (a: IPatch, b: IPatch) => dateSort(a, b), groupLabel: "Datum", },
    { label: "Nyast-Äldst", key: "newold-upload", sort: (a: IPatch, b: IPatch) => dateSort(b, a), default: true, groupLabel: "Datum", },

    { label: "Nyast-Äldst", key: "newold-release", sort: (a: IPatch, b: IPatch) => releaseSort(a, b), groupLabel: "Uppladdningsdatum" },
    { label: "Äldst-Nyast", key: "oldnew-release", sort: (a: IPatch, b: IPatch) => releaseSort(b, a), groupLabel: "Uppladdningsdatum" },

    { label: "Stigande", key: "id-asc", sort: (a: IPatch, b: IPatch) => a.id > b.id ? 1 : -1, groupLabel: "ID" },
    { label: "Fallande", key: "id-desc", sort: (a: IPatch, b: IPatch) => a.id < b.id ? 1 : -1, groupLabel: "ID" },
]

const ITEMS_PER_PAGE = 35;

export const PatchArchive: React.FC = props => {

    const [patches, setPatches] = useState([]);
    const [fetchingPatches, setFetchingPatches] = useState(true);
    const [edit, setEdit] = useState(false);
    const [tags, setTags] = useState([]);
    const [patchQuery, setPatchQuery] = useState("");
    const [sortOption, setSortOption] = useState(PATCH_SORT_MODES.find(x => x.default)?.key!);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedPatch, setSelectedPatch] = useState<IPatch | null>(null);
    const pageRef = useRef(document.createElement("div"));
    // const history = useHistory();
    const navigate = useNavigate();
    const location = useLocation();
    const isSmallScreen = useScreenSizeChecker(1100);
    // Sorted patches
    const sortPatches = useMemo(() => {
        return patches.sort(PATCH_SORT_MODES.find(x => x.key === sortOption)?.sort);
    }, [patches, sortOption])
    const [resultingPatches, setResultingPatches] = useState<IPatch[]>(sortPatches);
    const [isSorting, setIsSorting] = useState<boolean>(true);
    // Pagination
    const [page, setPage] = useState(1);
    const minPage = 1
    const numPages = Math.ceil(resultingPatches.length / ITEMS_PER_PAGE)
    const [itemsOnCurrentPage, setItemsOnCurrentPage] = useState<IPatch[]>([]);

    const nextPage = () => {
        if (page === numPages) return;
        setPage(page + 1);
    }

    const previousPage = () => {
        if (page === minPage) return;
        setPage(page - 1);
    }

    const firstPage = () => {
        if (page === minPage) return;
        setPage(minPage);
    }
    const lastPage = () => {
        if (page === numPages) return;
        setPage(numPages);
    }

    useEffect(() => {
        const low = (page - 1) * ITEMS_PER_PAGE;
        const high = low + ITEMS_PER_PAGE;
        setItemsOnCurrentPage(resultingPatches.slice(low, high))
    }, [page, resultingPatches])

    const fetchPatches = async () => {
        const response = await axios.get(url("/api/patches/all"), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            }
        })
        if (response.status !== 200) {
            // TODO
        } else {
            setFetchingPatches(false)
            setPatches(response.data.body)
        }
    }

    // Fetch patches on mount
    useEffect(() => {

        (async () => {
            await fetchPatches();
        })()
    }, [])

    // Fetch tags on mount
    useEffect(() => {
        (async () => {
            const response = await axios.get(url("/api/tags/all?type=PATCH"));
            if (response.status !== 200) {
                // TODO
                return;
            }

            setTags(response.data.body);
        })()
    }, []);


    // Set selected patch when location string or patches array is changed
    useEffect(() => {
        const { search } = location;
        const { patch } = queryString.parse(search);
        if (patch) {
            setSelectedPatch(patches.filter((p: IPatch) => p.id === Number(patch))[0] ?? null);
            if (isSmallScreen) {
                setTimeout(() =>
                    pageRef.current.scrollIntoView({ behavior: "smooth" })
                    , 50
                )
            }
        }
    }, [location, patches])

    const clickPatch = (patch: IPatch) => {
        if (edit) return;
        setSelectedPatch(patch);
        // history.push({
        //     search: `?patch=${patch.id}`,
        //     // from is used in ScrollToTop.tsx. It makes us not scroll to top
        //     state: { from: ROUTES.PATCH_ARCHIVE }
        // })
        navigate(
            {
                search: `?patch=${patch.id}`,
                // from is used in ScrollToTop.tsx. It makes us not scroll to top
            },
            { state: { from: ROUTES.PATCH_ARCHIVE } }
        )
        if (isSmallScreen) {
            pageRef.current.scrollTo({ behavior: "smooth", top: 0 })
        }
    }

    const patchClose = () => {
        setSelectedPatch(null);
        // history.push({
        //     pathname: ROUTES.PATCH_ARCHIVE,
        //     state: { from: ROUTES.PATCH_ARCHIVE }
        // });
        navigate(
            {
                pathname: ROUTES.PATCH_ARCHIVE,
            },
            {
                state: { from: ROUTES.PATCH_ARCHIVE }
            }
        )
        setEdit(false)
    }

    const selectedTagsIncludesTag = (tag: ITag) => {
        return selectedTags.filter((x: ITag) => x.id === tag.id).length > 0
    }

    const patchTagsMatchesSelected = (patch: IPatch): boolean => {
        const { tags } = patch;
        //If no tags are selected, show all patches
        if (selectedTags.length === 0) return true
        //Past the if statement above, we know we have selected at least one tag.

        //If patch has no tags, do not match
        if (tags.length === 0) return false

        //Returns an array with booleans where each boolean represents a tag match.
        const hits: number[] = tags.map((x, i) => {
            if (selectedTagsIncludesTag(x)) return 1
            else return 0
        })

        let tagMatches
        //This line is because of reduce, when you reduce an array with one element, it only takes the accumulator value.
        if (hits.length === 1) tagMatches = hits[0]
        else tagMatches = hits.reduce((acc, curr) => acc + curr)
        return tagMatches === selectedTags.length
    }

    const matchesSearch = (patch: IPatch): boolean => {
        const pname = patch.name.toLowerCase();
        const query = new RegExp(patchQuery.toLowerCase(), "g");
        
        // const matchesCreators = patch.creators.reduce((acc, val) => {
        //     return (val.toLowerCase().match(query) !== null) || acc;
        // }, false)

        const matchesCreators = patch.createdBy.reduce((result, creator) => {
            return creator.name.toLowerCase().match(query) !== null || result;
        }, false)

        return (pname.match(query) !== null) || matchesCreators;
    }

    const filterPatches = () => {
        setResultingPatches(sortPatches.filter((p: IPatch) => matchesSearch(p) && patchTagsMatchesSelected(p)));
        setIsSorting(false)
    }

    // Delay filter of patches until you have stopped typing/stopped clicking tags/stopped applying sort filters for 1 second
    useEffect(() => {
        setIsSorting(true)
        const delay = setTimeout(filterPatches, 1000);
        return () => clearTimeout(delay);
    }, [patchQuery, sortOption, selectedTags, patches])

    const deletePatch = async (id: number) => {
        if (window.confirm("Är du säker på att du vill radera märket? All data om märket kommer tas bort, inklusive filer tillhörande märket")) {
            const result = await axios.delete(url(`/api/patches/${id}`), {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            if (result.status === 200) {
                setPatches(patches.filter((p: IPatch) => p.id !== id))
                patchClose()
            }
        }
    }

    return (
        <div style={{ backgroundColor: "#eee" }} ref={pageRef}>
            <FancyHeader title="Märkesarkiv">
                <br />
                <p>Har du ett märke som inte finns i arkivet? Är märket inte påsytt? Donera märket till arkivet. Mejla <a href="mailto:historiker@d.kth.se" target="_blank" rel="noopener noreferrer" style={{color: "white"}}>historiker@d.kth.se</a>.</p>
                <p>För att se efterlysta märken, <a href="https://docs.google.com/document/d/e/2PACX-1vRW7-2RSdsnFRINgOViVs-R8gFoQYaCdpEHAkASgYfpKODpnFZCXzn1_KVF_41-AvP6QsJiVsf2SC0I/pub" target="_blank" rel="noopener noreferrer" style={{color: "white"}}>klicka här</a></p>
                <br />
            </FancyHeader>
            <Helmet>
                <title>{title("Märkesarkiv")}</title>
            </Helmet>
            <StyledPatchArchiveDivider>
                <Left>
                    <FilterAndSort
                        gotoFirstPage={firstPage}
                        label={"Sök bland " + patches.length + " märken"}
                        patchQuery={patchQuery}
                        setPatchQuery={setPatchQuery}
                        sortOption={sortOption}
                        setSortOption={setSortOption}
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                        tags={tags}
                    />
                    <StyledPatchArchive>
                        {fetchingPatches || isSorting &&
                            <SpinnerCover />
                        }
                        {!fetchingPatches && resultingPatches.length === 0 && !isSorting &&
                            <div style={{textAlign: "center", width: "100%", margin: "auto"}}>
                                Inga märken hittades
                            </div>
                        }
                        {!fetchingPatches && resultingPatches.length !== 0 && !isSorting &&
                            <StyledFlipMove duration={150} appearAnimation="fade" enterAnimation="fade" leaveAnimation="fade">
                                {
                                    itemsOnCurrentPage
                                    .map((x: IPatch, i: number) =>
                                        <Patch
                                            key={`patch-${i}-${x.id}`}
                                            patch={x}
                                            onClick={(patch: IPatch) => clickPatch(patch)}
                                            disabled={edit}
                                        />
                                    )
                                }
                            </StyledFlipMove>
                        }
                        {!fetchingPatches && resultingPatches.length !== 0 && !isSorting &&
                            <Pagination
                                page={page}
                                minPage={minPage}
                                numPages={numPages}
                                firstPage={firstPage}
                                lastPage={lastPage}
                                nextPage={nextPage}
                                previousPage={previousPage}
                            />
                        }
                    </StyledPatchArchive>
                </Left>
                {selectedPatch !== null &&
                    <Right>
                        <StyledFlipMoveDetails appearAnimation="fade" leaveAnimation="fade" enterAnimation="fade" duration={250}>
                            <WrappedPatchDetails
                                editApiPath="/api/patches/update"
                                patch={selectedPatch}
                                onClose={patchClose}
                                allTags={tags}
                                fetchPatches={fetchPatches}
                                edit={edit}
                                setEdit={setEdit}
                                type="patch"
                                onDeleteClick={deletePatch}
                            />
                        </StyledFlipMoveDetails>
                    </Right>
                }
            </StyledPatchArchiveDivider>
        </div>
    );
};

interface PaginationProps {
    page: number;
    minPage: number;
    numPages: number;
    firstPage: () => void;
    lastPage: () => void;
    nextPage: () => void;
    previousPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ firstPage, lastPage, minPage, nextPage, numPages, page, previousPage }) => {
    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", userSelect: "none" }}>
            <ul className="pagination">
                <li className={page === minPage ? "disabled" : ""} onClick={firstPage}><span>«</span></li>
                <li className={page === minPage ? "disabled" : ""} onClick={previousPage}><span>‹</span></li>
                <li className="disabled"><span>Sida {page} av {numPages}</span></li>
                <li className={page === numPages ? "disabled" : ""} onClick={nextPage}><span>›</span></li>
                <li className={page === numPages ? "disabled" : ""} onClick={lastPage}><span>»</span></li>
            </ul>
        </div>
    )
}
