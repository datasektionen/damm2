import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyledPatchArchive, StyledFlipMove, StyledPatchArchiveDivider, Left, Right, StyledFlipMoveDetails } from './style';
import { FancyHeader } from '../../components/FancyHeader/FancyHeader';
import axios from 'axios';
import { url } from '../../common/api';
import { Patch } from '../../components/Patch/Patch';
import { IPatch, ITag } from '../../types/definitions';
import { FilterAndSort } from './compositions/FilterAndSort/FilterAndSort';
import { WrappedPatchDetails } from './compositions/PatchDetails/PatchDetails';
import { useHistory, useLocation } from 'react-router-dom';
import { ROUTES } from '../../common/routes';
import { SpinnerCover } from '../../components/SpinnerCover/SpinnerCover';
import queryString from 'query-string';
import useScreenSizeChecker from '../../hooks/useScreenSizeChecker';
import Helmet from 'react-helmet';
import { title } from '../../common/strings';

export const PATCH_SORT_MODES = {
    AÖ: "a-ö",
    ÖA: "ö-a",
    "1983nu": "1983-nu",
    nu1983: "nu-1983",
    newold: "ny-äldst",
    oldnew: "äldst-new",
}

export const PatchArchive: React.FC = props => {

    const [patches, setPatches] = useState([]);
    const [fetchingPatches, setFetchingPatches] = useState(true);
    const [edit, setEdit] = useState(false);
    const [tags, setTags] = useState([]);
    const [patchQuery, setPatchQuery] = useState("");
    const [sortOption, setSortOption] = useState(PATCH_SORT_MODES.nu1983);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedPatch, setSelectedPatch] = useState<IPatch | null>(null);
    const pageRef = useRef(document.createElement("div"));
    const history = useHistory();
    const location = useLocation();
    const isSmallScreen = useScreenSizeChecker(1100);

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
        history.push({
            search: `?patch=${patch.id}`,
            // from is used in ScrollToTop.tsx. It makes us not scroll to top
            state: { from: ROUTES.PATCH_ARCHIVE }
        })
        if (isSmallScreen) {
            pageRef.current.scrollTo({ behavior: "smooth", top: 0 })
        }
    }

    const patchClose = () => {
        setSelectedPatch(null);
        history.push({
            pathname: ROUTES.PATCH_ARCHIVE,
            state: { from: ROUTES.PATCH_ARCHIVE }
        });
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

    const sortPatches = useMemo(() => {
        if (sortOption === PATCH_SORT_MODES.AÖ) return patches.sort((a: IPatch, b: IPatch) => {
            const A = a.name.toLowerCase();
            const B = b.name.toLowerCase();
            if (A < B) return -1;
            if (A > B) return 1;
            else return 0;
        })
        if (sortOption === PATCH_SORT_MODES.ÖA) return patches.sort((a: IPatch, b: IPatch) => {
            const A = a.name.toLowerCase();
            const B = b.name.toLowerCase();
            if (A > B) return -1;
            if (A < B) return 1;
            else return 0;
        })
        if (sortOption === PATCH_SORT_MODES.nu1983) return patches.sort((a: IPatch, b: IPatch) => (b.date === "" ? 0 : new Date(b.date).getTime()) - (a.date === "" ? 0 : new Date(a.date).getTime()));
        if (sortOption === PATCH_SORT_MODES['1983nu']) return patches.sort((a: IPatch, b: IPatch) => (a.date === "" ? 0 : new Date(a.date).getTime()) - (b.date === "" ? 0 : new Date(b.date).getTime()));
        if (sortOption === PATCH_SORT_MODES.newold) return patches.sort((a: IPatch, b: IPatch) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if (sortOption === PATCH_SORT_MODES.oldnew) return patches.sort((a: IPatch, b: IPatch) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return patches;
    }, [patches, sortOption])

    const matchesSearch = (patch: IPatch): boolean => {
        const pname = patch.name.toLowerCase();
        const query = new RegExp(patchQuery.toLowerCase(), "g");
        
        const matchesCreators = patch.creators.reduce((acc, val) => {
            return (val.toLowerCase().match(query) !== null) || acc;
        }, false)

        return (pname.match(query) !== null) || matchesCreators;
    }

    const [resultingPatches, setResultingPatches] = useState<IPatch[]>(sortPatches);
    const [isSorting, setIsSorting] = useState<boolean>(true);

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
                                    resultingPatches
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
