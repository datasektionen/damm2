import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { StyledPatchArchive, StyledFlipMove, Centered, StyledPatchArchiveDivider, Left, Right, StyledFlipMoveDetails } from './style';
import { FancyHeader } from '../../components/FancyHeader/FancyHeader';
import axios from 'axios';
import { url } from '../../common/api';
import { Patch } from '../../components/Patch/Patch';
import { IPatch, ITag } from '../../types/definitions';
import { FilterAndSort } from './compositions/FilterAndSort/FilterAndSort';
import { PatchDetails, WrappedPatchDetails } from './compositions/PatchDetails/PatchDetails';
import FlipMove from 'react-flip-move';
import { useHistory, useParams } from 'react-router-dom';
import { ROUTES } from '../../common/routes';

export const PATCH_SORT_MODES = {
  AÖ: "a-ö",
  ÖA: "ö-a",
  "1983nu": "1983-nu",
  nu1983: "nu-1983",
  newold: "ny-äldst",
  oldnew: "äldst-new",
}

interface Params {
  patchId: string;
}

export const PatchArchive: React.FC = props => {

  const [patches, setPatches] = useState([]);
  const [patchQuery, setPatchQuery] = useState("");
  const [sortOption, setSortOption] = useState(PATCH_SORT_MODES.nu1983);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPatch, setSelectedPatch] = useState<IPatch | null>(null);
  const headerRef = useRef(document.createElement("div"));
  const { patchId } = useParams<Params>();
  const history = useHistory();

  useEffect(() => {

    (async () => {
      const response = await axios.get(url("/api/patches/all"))
      if (response.status !== 200) {

      } else {
        setPatches(response.data.body)
        setSelectedPatch(response.data.body.filter((p: IPatch) => p.id === Number(patchId))[0] ?? null)
      }
    })()
  }, [])

  const clickPatch = (patch: IPatch) => {
    setSelectedPatch(patch);
    // window.scrollTo({ behavior: "smooth", top: headerRef.current.getBoundingClientRect().height })
    history.push(ROUTES.PATCH_ARCHIVE_ID.replace(":patchId", patch.id.toString()))
  }

  const patchClose = () => {
    setSelectedPatch(null);
    history.push(ROUTES.PATCH_ARCHIVE);
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
    const hits = tags.map((x, i) => {
      if (selectedTagsIncludesTag(x)) return true
      else return false
    })

    let tagMatches
    //Could just do hits[0] + 0 since true + 0 = 1 and false + 0 = 0, but you never know with js
    //This line is because of reduce, when you reduce an array with one element, it only takes the accumulator value.
    if (hits.length === 1) tagMatches = hits[0] === true ? 1 : 0
    //true + true = 2, true + false = 1 and so on, but I do this below to be more clear
    else tagMatches = hits.reduce((acc, curr) => (acc === true ? 1 : 0) + (curr === true ? 1 : 0) === 0 ? false : true)
    return tagMatches === selectedTags.length
  }

  const sortPatches = useMemo(() => {
    if (sortOption === PATCH_SORT_MODES.AÖ) return [...patches].sort((a: IPatch, b: IPatch) => {
      const A = a.name.toLowerCase();
      const B = b.name.toLowerCase();
      if (A < B) return -1;
      if (A > B) return 1;
      else return 0;
    })
    if (sortOption === PATCH_SORT_MODES.ÖA) return [...patches].sort((a: IPatch, b: IPatch) => {
      const A = a.name.toLowerCase();
      const B = b.name.toLowerCase();
      if (A > B) return -1;
      if (A < B) return 1;
      else return 0;
    })
    if (sortOption === PATCH_SORT_MODES['1983nu']) return [...patches].sort((a: IPatch, b: IPatch) => (b.date === "" ? 0 : new Date(b.date).getTime()) - (a.date === "" ? 0 : new Date(a.date).getTime()));
    if (sortOption === PATCH_SORT_MODES.nu1983) return [...patches].sort((a: IPatch, b: IPatch) => (a.date === "" ? 0 : new Date(a.date).getTime()) - (b.date === "" ? 0 : new Date(b.date).getTime()));
    if (sortOption === PATCH_SORT_MODES.newold) return [...patches].sort((a: IPatch, b: IPatch) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sortOption === PATCH_SORT_MODES.oldnew) return [...patches].sort((a: IPatch, b: IPatch) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return [...patches];
  }, [patches, sortOption])

  const matchesSearch = (patch: IPatch): boolean => {
    return patch.name.toLowerCase().match(new RegExp(patchQuery.toLowerCase(), "g")) !== null;
  }

  const resultingPatches = useMemo(() => {
    return sortPatches.filter((p: IPatch) => matchesSearch(p) && patchTagsMatchesSelected(p))
  }, [sortOption, patchQuery, selectedTags, patches])

  return (
    <div style={{ backgroundColor: "#eee" }}>
      <FancyHeader ref={headerRef} />
      <StyledPatchArchiveDivider>
        <Left>
          <FilterAndSort
            numberOfPatches={patches.length}
            patchQuery={patchQuery}
            setPatchQuery={setPatchQuery}
            sortOption={sortOption}
            setSortOption={setSortOption}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
          <StyledPatchArchive>
            {/* {resultingPatches.length === 0 &&
              <Centered>
                Inga märken hittades
              </Centered>
            } */}
            <StyledFlipMove duration={250} appearAnimation="fade" enterAnimation="fade" leaveAnimation="fade" maintainContainerHeight={true}>
              {
                resultingPatches
                  .map((x: IPatch, i: number) =>
                    <Patch key={`patch-${i}-${x.id}`} patch={x} onClick={(patch: IPatch) => clickPatch(patch)} />
                  )
              }
            </StyledFlipMove>
          </StyledPatchArchive>
        </Left>
        {selectedPatch !== null &&
          <Right>
            <StyledFlipMoveDetails appearAnimation="fade" leaveAnimation="fade" enterAnimation="fade" duration={250}>
              <WrappedPatchDetails patch={selectedPatch} onClose={patchClose} />
            </StyledFlipMoveDetails>
          </Right>
        }
      </StyledPatchArchiveDivider>
    </div>
  );
};