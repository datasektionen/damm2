import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DataGrid, { Column, SelectColumn, SortColumn } from 'react-data-grid';
import { Bag, IPatch, ITag } from '../../types/definitions';
import { groupBy as rowGrouper } from 'lodash';
import { Button } from '../../components/Button/Button';
import { Checkbox } from '../../components/Checkbox/Checkbox';

interface Row {
  id: string;
  image: string;
  name: string;
  tags: ITag[];
  amount: number;
  bag: string;
}

const columns: Column<Row>[] = [
  SelectColumn,
  // { key: "id", name: "ID", width: 30 },
  {
    key: 'image',
    name: 'Bild',
    sortable: true,
    width: 30,
    formatter: ({ row }) => (
      <span style={{ display: 'flex', justifyContent: 'center' }}>
        <img
          src={row.image}
          style={{ width: '35px', height: '35px', objectFit: 'cover' }}
        />
      </span>
    ),
  },
  { key: 'name', name: 'Namn', sortable: true },
  { key: 'date', name: 'Datum', sortable: true },
  {
    key: 'tags',
    name: 'Taggar',
    sortable: true,
    resizable: true,
    formatter: ({ row }) => (
      <div>
        {row.tags.map((t) => (
          <span
            key={'patch-tag' + t.name + '-' + t.id}
            title={t.description}
            style={{
              color: t.color,
              backgroundColor: t.backgroundColor,
              padding: '5px',
              borderRadius: '20px',
              margin: '0 2px',
              fontSize: '10px',
              height: '20px',
            }}
          >
            {t.name}
          </span>
        ))}
      </div>
    ),
  },
  { key: 'bag', name: 'Påse', sortable: true, width: 150},
  { key: 'box', name: 'Låda', sortable: true },
  {
    key: 'amount',
    name: 'Antal',
    groupFormatter({ childRows }) {
      return <>{childRows.reduce((acc, { amount }) => acc + amount, 0)}</>;
    },
    sortable: true,
  },
];

const groupByOptions = [
  { label: 'Låda', value: 'box' },
  { label: 'Påse', value: 'bag' },
];

export const PatchList = () => {
  const [patches, setPatches] = useState<IPatch[]>([]);
  const [bags, setBags] = useState<Bag[]>([]);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<unknown>>(
    new Set()
  );
  const [selectedRows, setSelectedRows] = useState<Set<string>>(
    () => new Set()
  );
  const [selectedBag, setSelectedBag] = useState<string>('');
  const [isAssigningPatches, setIsAssigningPatches] = useState(false);
  const [isSavingAmount, setIsSavingAmount] = useState(false);

  const [amount, setAmount] = useState<number>(0);
  const [showOnlyNoTags, setShowOnlyNoTags] = useState<boolean>(false);
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

  const getPatches = () => {
    axios
      .get('/api/patches/all')
      // axios.get("https://damm.datasektionen.se/api/patches/all")
      .then((res) => setPatches(res.data.body));
  };

  const getBags = () => {
    axios.get('/api/storage/bag/all').then((res) => setBags(res.data.body));
  };

  const toggleGroupBy = (key: string) => {
    if (groupBy.includes(key)) setGroupBy(groupBy.filter((o) => o !== key));
    else setGroupBy([...groupBy, key]);
  };

  useEffect(getPatches, []);
  useEffect(getBags, []);

  useEffect(() => {
    // boxes is empty on first render, making our value for selectedBox undefined. Set it as soon as boxes has data
    if (!selectedBag && bags.length !== 0) {
      setSelectedBag(`${bags[0].id}`);
    }
  });

  const assignPatchesToBag = useCallback(() => {
    if (selectedRows.size === 0) return;
    setIsAssigningPatches(true);

    axios
      .put('/api/storage/patches/bag', {
        patches: Array.from(selectedRows),
        bagId: parseInt(selectedBag),
      })
      .then(() => {
        setSelectedRows(new Set());
        const next = patches.map((p) => {
          if (selectedRows.has(p.id as any)) {
            return {
              ...p,
              bagId: parseInt(selectedBag),
              bag: bags.find((b) => b.id === parseInt(selectedBag)),
            };
          } else return p;
        });

        setPatches(next);
        getPatches();
      })
      .finally(() => setIsAssigningPatches(false));
  }, [selectedBag, selectedRows]);

  const assignAmountToPatches = useCallback(() => {
    if (selectedRows.size === 0) return;
    setIsSavingAmount(true);

    axios
      .put('/api/storage/patches/amount', {
        patches: Array.from(selectedRows),
        amount,
      })
      .then(() => {
        setSelectedRows(new Set());
        const next: IPatch[] = patches.map((p) => {
          if (selectedRows.has(p.id as any)) {
            return {
              ...p,
              amount,
            };
          } else return p;
        });

        setPatches(next);
        getPatches();
      })
      .finally(() => setIsSavingAmount(false));
  }, [amount, selectedRows]);

  const onSelectedRowsChange = useCallback(
    (selected: Set<string>) => {
      if (selected.size === 1) {
        setAmount(
          patches.find((p) => p.id === parseInt(Array.from(selected)[0]))
            ?.amount ?? 0
        );
      }
      setSelectedRows(selected);
    },
    [patches]
  );

  type Comparator = (a: Row, b: Row) => number;

  function getComparator(sortColumn: string): Comparator {
    switch (sortColumn) {
      case 'image':
        return (a, b) => {
          return a[sortColumn].localeCompare(b[sortColumn]);
        };
      case 'name':
        return (a, b) => {
          return a[sortColumn].localeCompare(b[sortColumn]);
        };
      case 'date':
        return (a, b) => {
          return (
            new Date(a[sortColumn]).getTime() -
            new Date(b[sortColumn]).getTime()
          );
        };
      case 'tags':
        return (a, b) => {
          return a[sortColumn].length - b[sortColumn].length;
        };
      case 'bag':
        return (a, b) => {
          return a[sortColumn].localeCompare(b[sortColumn]);
        };
      case 'box':
        return (a, b) => {
          return a[sortColumn].localeCompare(b[sortColumn]);
        };
      case 'amount':
        return (a, b) => {
          return a[sortColumn] - b[sortColumn];
        };
      default:
        throw new Error(`unsupported sortColumn: "${sortColumn}"`);
    }
  }
  const rows: readonly Row[] = patches
    .filter((x) => (showOnlyNoTags ? x.tags.length === 0 : true))
    .map((p) => ({
      id: p.id.toString(),
      name: p.name,
      image: p.images[1],
      tags: p.tags,
      date: p.date,
      bag: p.bag?.name ?? 'Ingen påse',
      amount: p.amount,
      box: p.bag?.box.name ?? 'Ingen låda',
    }));

  const sortedRows = useMemo((): readonly Row[] => {
    if (sortColumns.length === 0) return rows;

    return [...rows].sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(sort.columnKey);
        const compResult = comparator(a, b);
        if (compResult !== 0) {
          return sort.direction === 'ASC' ? compResult : -compResult;
        }
      }
      return 0;
    });
  }, [patches, sortColumns, rows]);

  return (
    <>
      <div>
        Gruppera efter:{' '}
        {groupByOptions.map((g) => (
          <label key={'group-opt-' + g.value}>
            <input
              name={g.value}
              type="checkbox"
              checked={groupBy.includes(g.value)}
              onChange={(e) => toggleGroupBy(e.target.name)}
            />{' '}
            {g.label}
          </label>
        ))}
      </div>
      <div
        style={{
          margin: '0 0 20px',
          display: 'flex',
          justifyContent: 'flex-start',
          alignContent: 'flex-start',
        }}
      >
        <Checkbox
          name="no-tags"
          label="Visa bara märken utan taggar"
          checked={showOnlyNoTags}
          setChecked={setShowOnlyNoTags}
        />
      </div>
      <DataGrid
        style={{ maxHeight: '100%', minHeight: '500px' }}
        sortColumns={sortColumns}
        onSortColumnsChange={setSortColumns}
        groupBy={groupBy}
        columns={columns}
        rowGrouper={rowGrouper}
        rowKeyGetter={(row) => row.id}
        selectedRows={selectedRows}
        onSelectedRowsChange={onSelectedRowsChange}
        expandedGroupIds={expandedGroupIds}
        onExpandedGroupIdsChange={setExpandedGroupIds}
        rows={sortedRows}
      />
      <div style={{ fontWeight: 'bold' }}>
        {selectedRows.size} märke{selectedRows.size !== 1 && 'n'} markerade
      </div>
      <div>
        Placera märke{selectedRows.size !== 1 ? 'n' : ''} i påse:{' '}
        <select
          value={selectedBag}
          onChange={(e) => setSelectedBag(e.target.value)}
          defaultValue={bags[0]?.id}
        >
          {bags.map((b) => (
            <option key={'opt-bag' + b.name + '-' + b.id} value={b.id}>
              {b.name} ({b.box.name})
            </option>
          ))}
        </select>
        <Button
          label="Spara"
          onClick={assignPatchesToBag}
          isLoading={isAssigningPatches}
          disabled={selectedRows.size === 0 || isSavingAmount}
        />
      </div>
      <div style={{ marginTop: 10 }}>
        Antal i arkivet:{' '}
        <input
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          type="number"
          min={0}
          disabled={
            selectedRows.size === 0 || isSavingAmount || isAssigningPatches
          }
        />
        <Button
          label="Spara"
          onClick={assignAmountToPatches}
          isLoading={isSavingAmount}
          disabled={selectedRows.size === 0 || isAssigningPatches}
        />
      </div>
    </>
  );
};
