import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyledPatchArchive,
  AnimatedPatchGrid,
  StyledPatchArchiveDivider,
  Left,
  Right,
  AnimatedPatchDetails,
} from './style';
import { FancyHeader } from '../../components/FancyHeader/FancyHeader';
import http from '../../common/api';
import { url } from '../../common/api';
import { Patch } from '../../components/Patch/Patch';
import { IPatch, ITag } from '../../types/definitions';
import { FilterAndSort } from './compositions/FilterAndSort/FilterAndSort';
import { PatchDetails } from './compositions/PatchDetails/PatchDetails';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../common/routes';
import { SpinnerCover } from '../../components/SpinnerCover/SpinnerCover';
import useScreenSizeChecker from '../../hooks/useScreenSizeChecker';
import { useTitle } from '../../hooks/useTitle';
import { title } from '../../common/strings';
import { useAppContext } from '../../hooks/useAppContext';
import { useDarkMode } from '../../hooks/useDarkMode';

const nameSort = (a: IPatch, b: IPatch) => {
  const A = a.name.toLowerCase();
  const B = b.name.toLowerCase();
  if (A < B) return -1;
  if (A > B) return 1;
  else return 0;
};

const dateSort = (a: IPatch, b: IPatch) => {
  return (
    (a.date === '' ? 0 : new Date(a.date).getTime()) -
    (b.date === '' ? 0 : new Date(b.date).getTime())
  );
};

const releaseSort = (a: IPatch, b: IPatch) => {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};

export const PATCH_SORT_MODES: {
  label: string;
  key: string;
  sort: (a: IPatch, b: IPatch) => number;
  default?: boolean;
  groupLabel: string;
}[] = [
  {
    label: 'A-Ö',
    key: 'AÖ',
    sort: (a: IPatch, b: IPatch) => nameSort(a, b),
    groupLabel: 'Namn',
  },
  {
    label: 'Ö-A',
    key: 'ÖA',
    sort: (a: IPatch, b: IPatch) => nameSort(b, a),
    groupLabel: 'Namn',
  },

  {
    label: 'Äldst-Nyast',
    key: 'oldnew-upload',
    sort: (a: IPatch, b: IPatch) => dateSort(a, b),
    groupLabel: 'Datum',
  },
  {
    label: 'Nyast-Äldst',
    key: 'newold-upload',
    sort: (a: IPatch, b: IPatch) => dateSort(b, a),
    default: true,
    groupLabel: 'Datum',
  },

  {
    label: 'Nyast-Äldst',
    key: 'newold-release',
    sort: (a: IPatch, b: IPatch) => releaseSort(a, b),
    groupLabel: 'Uppladdningsdatum',
  },
  {
    label: 'Äldst-Nyast',
    key: 'oldnew-release',
    sort: (a: IPatch, b: IPatch) => releaseSort(b, a),
    groupLabel: 'Uppladdningsdatum',
  },

  {
    label: 'Stigande',
    key: 'id-asc',
    sort: (a: IPatch, b: IPatch) => (a.id > b.id ? 1 : -1),
    groupLabel: 'ID',
  },
  {
    label: 'Fallande',
    key: 'id-desc',
    sort: (a: IPatch, b: IPatch) => (a.id < b.id ? 1 : -1),
    groupLabel: 'ID',
  },

  {
    label: 'Stigande',
    key: 'amount-asc',
    sort: (a: IPatch, b: IPatch) => (a.amount > b.amount ? 1 : -1),
    groupLabel: 'Antal i arkiv',
  },
  {
    label: 'Fallande',
    key: 'amount-desc',
    sort: (a: IPatch, b: IPatch) => (a.amount < b.amount ? 1 : -1),
    groupLabel: 'Antal i arkiv',
  },
];

const ITEMS_PER_PAGE = 35;

export const PatchArchive: React.FC = () => {
  useTitle(title('Märkesarkiv'));
  const [patches, setPatches] = useState<IPatch[]>([]);
  const [fetchingPatches, setFetchingPatches] = useState(true);
  const [edit, setEdit] = useState(false);
  const [tags, setTags] = useState<ITag[]>([]);
  const [patchQuery, setPatchQuery] = useState('');
  const [sortOption, setSortOption] = useState(
    PATCH_SORT_MODES.find((x) => x.default)!.key
  );
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);
  const pageRef = useRef(document.createElement('div'));
  // const history = useHistory();
  const navigate = useNavigate();
  const location = useLocation();
  const isSmallScreen = useScreenSizeChecker(1100);

  const selectedPatchId = new URLSearchParams(location.search).get('patch');
  const selectedPatch =
    selectedPatchId === null
      ? null
      : (patches.find((p) => p.id === Number(selectedPatchId)) ?? null);

  // Delay filtering until you have stopped typing/clicking tags/changing sort for 1 second
  const filterInput = useMemo(
    () => ({ patchQuery, sortOption, selectedTags, patches }),
    [patchQuery, sortOption, selectedTags, patches]
  );
  const [appliedFilter, setAppliedFilter] = useState(filterInput);
  useEffect(() => {
    const delay = setTimeout(() => setAppliedFilter(filterInput), 1000);
    return () => clearTimeout(delay);
  }, [filterInput]);
  const isSorting = appliedFilter !== filterInput;

  const resultingPatches = useMemo(() => {
    const { patchQuery, sortOption, selectedTags, patches } = appliedFilter;
    const query = patchQuery.toLowerCase();
    const selectedTagIds = selectedTags.map((t) => t.id);
    const sort = PATCH_SORT_MODES.find((x) => x.key === sortOption)?.sort;

    return [...patches]
      .sort(sort)
      .filter(
        (p) =>
          (p.name.toLowerCase().includes(query) ||
            p.createdBy.some((c) => c.name.toLowerCase().includes(query))) &&
          (selectedTagIds.length === 0 ||
            p.tags.some((t) => selectedTagIds.includes(t.id)))
      );
  }, [appliedFilter]);

  // Pagination
  const [page, setPage] = useState(1);
  const minPage = 1;
  const numPages = Math.ceil(resultingPatches.length / ITEMS_PER_PAGE);
  const pageStart = (page - 1) * ITEMS_PER_PAGE;
  const itemsOnCurrentPage = resultingPatches.slice(
    pageStart,
    pageStart + ITEMS_PER_PAGE
  );

  const { admin } = useAppContext();
  const { isDarkModeEnabled } = useDarkMode();
  const isAdmin = admin.includes('admin') || admin.includes('prylis');

  const nextPage = () => {
    if (page === numPages) return;
    setPage(page + 1);
  };

  const previousPage = () => {
    if (page === minPage) return;
    setPage(page - 1);
  };

  const firstPage = () => {
    if (page === minPage) return;
    setPage(minPage);
  };
  const lastPage = () => {
    if (page === numPages) return;
    setPage(numPages);
  };

  const fetchPatches = async () => {
    const response = await http.get<{ body: IPatch[] }>(
      url('/api/patches/all'),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
        },
      }
    );
    if (response.status !== 200) {
      // TODO
    } else {
      setFetchingPatches(false);
      setPatches(response.data.body);
    }
  };

  // Fetch patches on mount
  useEffect(() => {
    (async () => {
      await fetchPatches();
    })();
  }, []);

  // Fetch tags on mount
  useEffect(() => {
    (async () => {
      const response = await http.get<{ body: ITag[] }>(
        url('/api/tags/all?type=PATCH')
      );
      if (response.status !== 200) {
        // TODO
        return;
      }

      setTags(response.data.body);
    })();
  }, []);

  // Scroll to the patch details on small screens when a patch is opened
  useEffect(() => {
    if (!selectedPatchId || !isSmallScreen) return;
    const delay = setTimeout(
      () => pageRef.current.scrollIntoView({ behavior: 'smooth' }),
      50
    );
    return () => clearTimeout(delay);
  }, [location, patches, selectedPatchId, isSmallScreen]);

  const clickPatch = (patch: IPatch) => {
    if (edit) return;
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
    );
    if (isSmallScreen) {
      pageRef.current.scrollTo({ behavior: 'smooth', top: 0 });
    }
  };

  const patchClose = () => {
    // history.push({
    //     pathname: ROUTES.PATCH_ARCHIVE,
    //     state: { from: ROUTES.PATCH_ARCHIVE }
    // });
    navigate(
      {
        pathname: ROUTES.PATCH_ARCHIVE,
      },
      {
        state: { from: ROUTES.PATCH_ARCHIVE },
      }
    );
    setEdit(false);
  };

  const deletePatch = async (id: number) => {
    if (
      window.confirm(
        'Är du säker på att du vill radera märket? All data om märket kommer tas bort, inklusive filer tillhörande märket'
      )
    ) {
      const result = await http.delete(url(`/api/patches/${id}`), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (result.status === 200) {
        setPatches(patches.filter((p: IPatch) => p.id !== id));
        patchClose();
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#eee' }} ref={pageRef}>
      <FancyHeader title="Märkesarkiv">
        <br />
        <p>
          Har du ett märke som inte finns i arkivet? Är märket inte påsytt?
          Donera märket till arkivet. Mejla{' '}
          <a
            href="mailto:historiker@datasektionen.se"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'white' }}
          >
            historiker@datasektionen.se
          </a>
          .
        </p>
        {(isDarkModeEnabled == false || (isDarkModeEnabled && isAdmin)) && (
          <p>
            För att se efterlysta märken,{' '}
            <a
              href="https://docs.google.com/document/d/e/2PACX-1vRW7-2RSdsnFRINgOViVs-R8gFoQYaCdpEHAkASgYfpKODpnFZCXzn1_KVF_41-AvP6QsJiVsf2SC0I/pub"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'white' }}
            >
              klicka här
            </a>
          </p>
        )}
        <br />
      </FancyHeader>
      <StyledPatchArchiveDivider>
        <Left>
          <FilterAndSort
            gotoFirstPage={firstPage}
            label={'Sök bland ' + patches.length + ' märken'}
            patchQuery={patchQuery}
            setPatchQuery={setPatchQuery}
            sortOption={sortOption}
            setSortOption={setSortOption}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            tags={tags}
          />
          <StyledPatchArchive>
            {(fetchingPatches || isSorting) && <SpinnerCover />}
            {!fetchingPatches &&
              resultingPatches.length === 0 &&
              !isSorting && (
                <div
                  style={{ textAlign: 'center', width: '100%', margin: 'auto' }}
                >
                  Inga märken hittades
                </div>
              )}
            {!fetchingPatches &&
              resultingPatches.length !== 0 &&
              !isSorting && (
                <AnimatedPatchGrid duration={150}>
                  {itemsOnCurrentPage.map((x: IPatch, i: number) => (
                    <Patch
                      key={`patch-${i}-${x.id}`}
                      patch={x}
                      onClick={(patch: IPatch) => clickPatch(patch)}
                      disabled={edit}
                    />
                  ))}
                </AnimatedPatchGrid>
              )}
            {!fetchingPatches &&
              resultingPatches.length !== 0 &&
              !isSorting && (
                <Pagination
                  page={page}
                  minPage={minPage}
                  numPages={numPages}
                  firstPage={firstPage}
                  lastPage={lastPage}
                  nextPage={nextPage}
                  previousPage={previousPage}
                />
              )}
          </StyledPatchArchive>
        </Left>
        {selectedPatch !== null && (
          <Right>
            <AnimatedPatchDetails duration={250}>
              <PatchDetails
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
            </AnimatedPatchDetails>
          </Right>
        )}
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

const Pagination: React.FC<PaginationProps> = ({
  firstPage,
  lastPage,
  minPage,
  nextPage,
  numPages,
  page,
  previousPage,
}) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
      }}
    >
      <ul className="pagination">
        <li className={page === minPage ? 'disabled' : ''} onClick={firstPage}>
          <span>«</span>
        </li>
        <li
          className={page === minPage ? 'disabled' : ''}
          onClick={previousPage}
        >
          <span>‹</span>
        </li>
        <li className="disabled">
          <span>
            Sida {page} av {numPages}
          </span>
        </li>
        <li className={page === numPages ? 'disabled' : ''} onClick={nextPage}>
          <span>›</span>
        </li>
        <li className={page === numPages ? 'disabled' : ''} onClick={lastPage}>
          <span>»</span>
        </li>
      </ul>
    </div>
  );
};
