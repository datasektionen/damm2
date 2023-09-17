import axios from 'axios';
import React, { useCallback, useMemo, useState } from 'react';
import DataGrid, { Column, SelectColumn } from 'react-data-grid';
import { Button } from '../../../components/Button/Button';
import { Box } from '../../../types/definitions';
import { groupBy as rowGrouper } from 'lodash';
import { CellStringInput } from '../../../components/CellStringInput/CellStringInput';

interface BoxRow {
  name: string;
  id: string;
  '#bags': number;
  '#patches': number;
}

interface Props {
  boxes: Box[];
  setBoxes: (boxes: Box[]) => void;
}

export const BoxDataGrid = ({ boxes, setBoxes }: Props) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(
    () => new Set()
  );
  const [isDeletingBoxes, setIsDeletingBoxes] = useState<boolean>(false);

  const deleteBoxes = useCallback(() => {
    if (selectedRows.size === 0) return;
    setIsDeletingBoxes(true);

    axios
      .post('/api/storage/boxes/delete', {
        boxes: Array.from(selectedRows),
      })
      .then(() => {
        setSelectedRows(new Set());
        const next = boxes.reduce((arr: Box[], box: Box) => {
          if (selectedRows.has(box.id as any)) return arr;
          else return [...arr, box];
        }, []);
        setBoxes(next);
      })
      .finally(() => setIsDeletingBoxes(false));
  }, [selectedRows]);

  const boxColumns: Column<BoxRow>[] = useMemo(() => {
    return [
      SelectColumn,
      { key: 'id', name: 'ID', width: 30 },
      {
        key: 'name',
        name: 'Namn',
        editor: ({ row }) => (
          <CellStringInput
            initial={row.name}
            row={row}
            onSave={updateBoxName}
          />
        ),
        formatter: ({ row }) => (
          <div
            title="Dubbelklicka för att redigera"
            style={{ cursor: 'pointer' }}
          >
            {row.name}
          </div>
        ),
      },
      { key: '#bags', name: 'Antal påsar' },
      { key: '#uniquePatches', name: 'Antal unika märken' },
      { key: '#patches', name: 'Antal märken' },
    ];
  }, [boxes]);

  const updateBoxName = async (rowId: number, value: string) => {
    return axios
      .put('/api/storage/box/name', {
        boxId: rowId,
        name: value,
      })
      .then(() => {
        const boxToUpdate = boxes.find((b) => b.id === rowId);
        if (!boxToUpdate) return;
        const next = [
          ...boxes.filter((b) => b.id !== rowId),
          {
            ...boxToUpdate,
            name: value,
          },
        ].sort((a, b) =>
          a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        );
        setBoxes(next);
      });
  };

  return (
    <>
      <p>Dubbelklicka på lådans namn för att redigera</p>
      <DataGrid
        columns={boxColumns}
        rowKeyGetter={(row) => row.id}
        rows={
          boxes.map((b) => ({
            id: b.id,
            name: b.name,
            '#uniquePatches': b['#uniquePatches'],
            '#bags': b.bags?.length,
            '#patches': b['#patches'],
          })) as any
        }
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        rowGrouper={rowGrouper}
      />
      <div style={{ marginTop: '10px' }}>
        <Button
          color="white"
          backgroundColor="red"
          label={`Radera låd${selectedRows.size !== 1 ? 'or' : 'a'}`}
          onClick={deleteBoxes}
          isLoading={isDeletingBoxes}
          disabled={selectedRows.size === 0 || selectedRows.size === 0}
        />
        <span style={{ marginLeft: '10px' }}>
          Du kan inte radera en låda som har påsar i sig
        </span>
      </div>
    </>
  );
};
