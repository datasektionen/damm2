import http from '../../../common/api';
import React, { useCallback, useMemo, useState } from 'react';
import { TreeDataGrid, SelectColumn, type Column } from 'react-data-grid';
import { Button } from '../../../components/Button/Button';
import { Bag, Box, IPatch } from '../../../types/definitions';
import { groupBy as rowGrouper } from '../../../functions/groupBy';
import { CellStringInput } from '../../../components/CellStringInput/CellStringInput';
import { Field } from '../../../components/Field/Field';

interface BagRow {
  name: string;
  id: number;
  belongsTo: string;
  uniquePatches: number;
  '#patches': number;
  patches: IPatch[];
}

interface Props {
  bags: Bag[];
  boxes: Box[];
  setBags: React.Dispatch<React.SetStateAction<Bag[]>>;
}

const groupByOptions = [{ label: 'Låda', value: 'belongsTo' }];

export const BagDataGrid = ({ bags, boxes, setBags }: Props) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(
    () => new Set()
  );
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<unknown>>(
    new Set()
  );

  const [selectedBoxState, setSelectedBox] = useState<string>('');
  const [assigningBags, setAssigningBags] = useState<boolean>(false);
  const [deletingBags, setDeletingBags] = useState<boolean>(false);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [security, setSecurity] = useState('');

  // Default to the first box until the user picks one
  const selectedBox =
    selectedBoxState || (boxes.length !== 0 ? `${boxes[0].id}` : '');

  const updateBagName = useCallback(
    async (rowId: number, value: string) => {
      return http
        .put('/api/storage/bag/name', {
          bagId: rowId,
          name: value,
        })
        .then(() => {
          setBags((bags) =>
            bags
              .map((b) => (b.id === rowId ? { ...b, name: value } : b))
              .sort((a, b) =>
                a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
              )
          );
        });
    },
    [setBags]
  );

  const bagColumns: Column<BagRow>[] = useMemo(() => {
    return [
      SelectColumn,
      { key: 'id', name: 'ID', width: 20 },
      {
        key: 'name',
        name: 'Namn',
        editable: true,
        renderEditCell: ({ row }) => (
          <CellStringInput
            initial={row.name}
            row={row}
            onSave={updateBagName}
          />
        ),
        renderCell: ({ row }) => (
          <div style={{ cursor: 'pointer' }}>{row.name}</div>
        ),
      },
      {
        key: 'belongsTo',
        name: 'Tillhör box',
      },
      {
        key: 'uniquePatches',
        name: 'Antal unika märken',
        renderCell: ({ row }) => (
          <div title={row.patches.map((p) => p.name).join(', ')}>
            {row.uniquePatches}
          </div>
        ),
      },
      { key: '#patches', name: 'Antal märken' },
    ];
  }, [updateBagName]);

  const assignBagsToBox = useCallback(() => {
    if (selectedRows.size === 0) return;
    setAssigningBags(true);

    http
      .put('/api/storage/bags/box', {
        bags: Array.from(selectedRows),
        boxId: parseInt(selectedBox),
      })
      .then(() => {
        setSelectedRows(new Set());
        setBags((bags) =>
          bags.map((b) =>
            selectedRows.has(b.id)
              ? {
                  ...b,
                  boxId: parseInt(selectedBox),
                  box: boxes.find((box) => box.id === parseInt(selectedBox))!,
                }
              : b
          )
        );
      })
      .finally(() => setAssigningBags(false));
  }, [selectedRows, selectedBox, boxes, setBags]);

  const deleteBags = useCallback(() => {
    if (selectedRows.size === 0) return;
    setDeletingBags(true);

    http
      .post('/api/storage/bags/delete', {
        bags: Array.from(selectedRows),
      })
      .then(() => {
        setSelectedRows(new Set());
        setBags((bags) => bags.filter((bag) => !selectedRows.has(bag.id)));
      })
      .finally(() => {
        setDeletingBags(false);
        setSecurity('');
      });
  }, [selectedRows, setBags]);

  const toggleGroupBy = (key: string) => {
    if (groupBy.includes(key)) setGroupBy(groupBy.filter((o) => o !== key));
    else setGroupBy([...groupBy, key]);
  };

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
      <p>Dubbelklicka på påsens namn för att redigera</p>
      <TreeDataGrid<BagRow, unknown, number>
        columns={bagColumns}
        groupBy={groupBy}
        rows={bags.map((b) => ({
          id: b.id,
          name: b.name,
          belongsTo: b.box.name,
          '#patches': b['#patches'],
          uniquePatches: b['#uniquePatches'],
          patches: b.patches ?? [],
        }))}
        rowKeyGetter={(row) => row.id}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        expandedGroupIds={expandedGroupIds}
        onExpandedGroupIdsChange={setExpandedGroupIds}
        rowGrouper={rowGrouper}
      />
      <div>
        Flytta påse/påsar till låda:{' '}
        <select
          value={selectedBox}
          onChange={(e) => setSelectedBox(e.target.value)}
          defaultValue={boxes[0]?.id}
        >
          {boxes.map((b) => (
            <option key={'opt-box-' + b.name + '-' + b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <Button
          label="Spara"
          onClick={assignBagsToBox}
          disabled={selectedRows.size === 0}
          isLoading={assigningBags}
        />
      </div>
      <div>
        <Button
          color="white"
          backgroundColor="red"
          label={`Radera pås${selectedRows.size !== 1 ? 'ar' : 'e'}`}
          onClick={deleteBags}
          isLoading={deletingBags}
          disabled={selectedRows.size === 0 || security != 'Radera permanent'}
        />
        <span>
          {' '}
          Raderar du påsen raderas endast påsen, inte dess innehåll. Skriv
          "Radera permanent" nedan för att radera
        </span>
      </div>
      <Field
        name="security"
        placeholder="Radera permanent"
        onChange={(e) => setSecurity(e.target.value)}
        value={security}
      />
    </>
  );
};
