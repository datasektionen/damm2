import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyledPatchArchive, StyledFlipMove, StyledPatchArchiveDivider, Left, Right, StyledFlipMoveDetails } from '../PatchArchive/style';
import { FancyHeader } from '../../components/FancyHeader/FancyHeader';
import axios from 'axios';
import { url } from '../../common/api';
import { Patch } from '../../components/Patch/Patch';
import { IArtefact, ITag } from '../../types/definitions';
import { FilterAndSort } from '../PatchArchive/compositions/FilterAndSort/FilterAndSort';
import { WrappedPatchDetails } from '../PatchArchive/compositions/PatchDetails/PatchDetails';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../common/routes';
import { SpinnerCover } from '../../components/SpinnerCover/SpinnerCover';
import queryString from 'query-string';
import useScreenSizeChecker from '../../hooks/useScreenSizeChecker';
import Helmet from 'react-helmet';
import { title } from '../../common/strings';

export const ARTEFACT_SORT_MODES = {
    AÖ: "a-ö",
    ÖA: "ö-a",
    "1983nu": "1983-nu",
    nu1983: "nu-1983",
    newold: "ny-äldst",
    oldnew: "äldst-new",
}

export const ArtefactArchive: React.FC = props => {

    const [artefacts, setArtefacts] = useState([]);
    const [fetchingArtefacts, setFetchingArtefacts] = useState(true);
    const [edit, setEdit] = useState(false);
    const [tags, setTags] = useState([]);
    const [artefactQuery, setArtefactQuery] = useState("");
    const [sortOption, setSortOption] = useState(ARTEFACT_SORT_MODES.nu1983);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedArtefact, setSelectedArtefact] = useState<IArtefact | null>(null);
    const pageRef = useRef(document.createElement("div"));
    // const history = useHistory();
    const navigate = useNavigate();
    const location = useLocation();
    const isSmallScreen = useScreenSizeChecker(1100);

    const fetchArtefacts = async () => {
        const response = await axios.get(url("/api/artefacts/all"), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            }
        })
        if (response.status !== 200) {
            // TODO
        } else {
            setFetchingArtefacts(false)
            setArtefacts(response.data.body)
        }
    }

    useEffect(() => {

        (async () => {
            await fetchArtefacts();
        })()
    }, [])

    useEffect(() => {
        (async () => {
            const response = await axios.get(url("/api/tags/all?type=ARTEFACT"));
            if (response.status !== 200) {
                // TODO
                return;
            }

            setTags(response.data.body);
        })()
    }, []);

    useEffect(() => {
        const { search } = location;
        const { artefact } = queryString.parse(search);
        if (artefact) {
            setSelectedArtefact(artefacts.filter((a: IArtefact) => a.id === Number(artefact))[0] ?? null);
            if (isSmallScreen) {
                setTimeout(() =>
                    pageRef.current.scrollIntoView({ behavior: "smooth" })
                    , 50
                )
            }
        }
    }, [location, artefacts])

    const clickArtefact = (artefact: IArtefact) => {
        if (edit) return;
        setSelectedArtefact(artefact);
        // history.push({
        //     search: `?artefact=${artefact.id}`,
        //     state: { from: ROUTES.MUSEUM }
        // })
        navigate(
            {
                search: `?artefact=${artefact.id}`,
            },
            {
                state: { from: ROUTES.MUSEUM }
            }
        )
        if (isSmallScreen) {
            pageRef.current.scrollTo({ behavior: "smooth", top: 0 })
        }
    }

    const artefactClose = () => {
        setSelectedArtefact(null);
        // history.push({
        //     pathname: ROUTES.MUSEUM,
        //     state: { from: ROUTES.MUSEUM }
        // });
        navigate(
            {
                pathname: ROUTES.MUSEUM,
            },
            {
                state: { from: ROUTES.MUSEUM }
            }
        )
        setEdit(false);
    }

    const selectedTagsIncludesTag = (tag: ITag) => {
        return selectedTags.filter((x: ITag) => x.id === tag.id).length > 0
    }

    const artefactTagsMatchesSelected = (artefact: IArtefact): boolean => {
        const { tags } = artefact;
        //If no tags are selected, show all artefacts
        if (selectedTags.length === 0) return true
        //Past the if statement above, we know we have selected at least one tag.

        //If artefact has no tags, do not match
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

    const sortArtefacts = useMemo(() => {
        if (sortOption === ARTEFACT_SORT_MODES.AÖ) return artefacts.sort((a: IArtefact, b: IArtefact) => {
            const A = a.name.toLowerCase();
            const B = b.name.toLowerCase();
            if (A < B) return -1;
            if (A > B) return 1;
            else return 0;
        })
        if (sortOption === ARTEFACT_SORT_MODES.ÖA) return artefacts.sort((a: IArtefact, b: IArtefact) => {
            const A = a.name.toLowerCase();
            const B = b.name.toLowerCase();
            if (A > B) return -1;
            if (A < B) return 1;
            else return 0;
        })
        if (sortOption === ARTEFACT_SORT_MODES.nu1983) return artefacts.sort((a: IArtefact, b: IArtefact) => (b.date === "" ? 0 : new Date(b.date).getTime()) - (a.date === "" ? 0 : new Date(a.date).getTime()));
        if (sortOption === ARTEFACT_SORT_MODES['1983nu']) return artefacts.sort((a: IArtefact, b: IArtefact) => (a.date === "" ? 0 : new Date(a.date).getTime()) - (b.date === "" ? 0 : new Date(b.date).getTime()));
        if (sortOption === ARTEFACT_SORT_MODES.newold) return artefacts.sort((a: IArtefact, b: IArtefact) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if (sortOption === ARTEFACT_SORT_MODES.oldnew) return artefacts.sort((a: IArtefact, b: IArtefact) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return artefacts;
    }, [artefacts, sortOption])

    const matchesSearch = (artefact: IArtefact): boolean => {
        return artefact.name.toLowerCase().match(new RegExp(artefactQuery.toLowerCase(), "g")) !== null;
    }

    const resultingArtefacts = useMemo(() => {
        return sortArtefacts.filter((a: IArtefact) => matchesSearch(a) && artefactTagsMatchesSelected(a))
    }, [sortOption, artefactQuery, selectedTags, artefacts])

    const deleteArtefact = async (id: number) => {
        if (window.confirm("Är du säker på att du vill radera föremålet? All data om föremålet kommer tas bort, inklusive filer tillhörande föremålet")) {
            const result = await axios.delete(url(`/api/artefacts/${id}`), {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            if (result.status === 200) {
                setArtefacts(artefacts.filter((a: IArtefact) => a.id !== id))
                artefactClose()
            }
        }
    }

    return (
        <div style={{ backgroundColor: "#eee" }} ref={pageRef}>
            <FancyHeader title="Museum">
                <br />
                <p>Ta en titt på sektionens historiska föremål</p>
            </FancyHeader>
            <Helmet>
                <title>{title("Museum")}</title>
            </Helmet>
            <StyledPatchArchiveDivider>
                <Left>
                    <FilterAndSort
                        gotoFirstPage={() => {}}
                        label={"Sök bland " + artefacts.length + " föremål"}
                        patchQuery={artefactQuery}
                        setPatchQuery={setArtefactQuery}
                        sortOption={sortOption}
                        setSortOption={setSortOption}
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                        tags={tags}
                    />
                    <StyledPatchArchive>
                        {fetchingArtefacts &&
                            <SpinnerCover />
                        }
                        {!fetchingArtefacts && resultingArtefacts.length === 0 &&
                            <div style={{textAlign: "center", width: "100%", margin: "auto"}}>
                                Inga föremål hittades
                            </div>
                        }
                        {!fetchingArtefacts && resultingArtefacts.length !== 0 &&
                            <StyledFlipMove duration={150} appearAnimation="fade" enterAnimation="fade" leaveAnimation="fade">
                                {
                                    resultingArtefacts
                                    .map((x: IArtefact, i: number) =>
                                        <Patch
                                            key={`artefact-${i}-${x.id}`}
                                            patch={{...x, creators: []}}
                                            onClick={(artefact: IArtefact) => clickArtefact(artefact)}
                                            disabled={edit}
                                        />
                                    )
                                }
                            </StyledFlipMove>
                        }
                    </StyledPatchArchive>
                </Left>
                {selectedArtefact !== null &&
                    <Right>
                        <StyledFlipMoveDetails appearAnimation="fade" leaveAnimation="fade" enterAnimation="fade" duration={250}>
                            <WrappedPatchDetails
                                editApiPath="/api/artefacts/update"
                                type="artefact"
                                patch={{...selectedArtefact, creators: []}}
                                onClose={artefactClose}
                                allTags={tags}
                                fetchPatches={fetchArtefacts}
                                edit={edit}
                                setEdit={setEdit}
                                onDeleteClick={deleteArtefact}
                            />
                        </StyledFlipMoveDetails>
                    </Right>
                }
            </StyledPatchArchiveDivider>
        </div>
    );
};