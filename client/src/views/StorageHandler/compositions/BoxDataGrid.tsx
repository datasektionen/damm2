import http from '../../../common/api';
import React, { useCallback, useMemo, useState } from 'react';
import { DataGrid, SelectColumn, type Column } from 'react-data-grid';
import { Button } from '../../../components/Button/Button';
import { Box } from '../../../types/definitions';
import { CellStringInput } from '../../../components/CellStringInput/CellStringInput';

interface BoxRow {
  name: string;
  id: number;
  '#bags'?: number;
  '#uniquePatches': number;
  '#patches': number;
}

interface Props {
  boxes: Box[];
  setBoxes: React.Dispatch<React.SetStateAction<Box[]>>;
}

export const BoxDataGrid = ({ boxes, setBoxes }: Props) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(
    () => new Set()
  );
  const [isDeletingBoxes, setIsDeletingBoxes] = useState<boolean>(false);

  const deleteBoxes = useCallback(() => {
    if (selectedRows.size === 0) return;
    setIsDeletingBoxes(true);

    http
      .post('/api/storage/boxes/delete', {
        boxes: Array.from(selectedRows),
      })
      .then(() => {
        setSelectedRows(new Set());
        setBoxes((boxes) => boxes.filter((box) => !selectedRows.has(box.id)));
      })
      .finally(() => setIsDeletingBoxes(false));
  }, [selectedRows, setBoxes]);

  const updateBoxName = useCallback(
    async (rowId: number, value: string) => {
      return http
        .put('/api/storage/box/name', {
          boxId: rowId,
          name: value,
        })
        .then(() => {
          setBoxes((boxes) =>
            boxes
              .map((b) => (b.id === rowId ? { ...b, name: value } : b))
              .sort((a, b) =>
                a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
              )
          );
        });
    },
    [setBoxes]
  );

  const boxColumns: Column<BoxRow>[] = useMemo(() => {
    return [
      SelectColumn,
      { key: 'id', name: 'ID', width: 30 },
      {
        key: 'name',
        name: 'Namn',
        renderEditCell: ({ row }) => (
          <CellStringInput
            initial={row.name}
            row={row}
            onSave={updateBoxName}
          />
        ),
        renderCell: ({ row }) => (
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
  }, [updateBoxName]);

  return (
    <>
      <p>Dubbelklicka på lådans namn för att redigera</p>
      <DataGrid<BoxRow, unknown, number>
        columns={boxColumns}
        rowKeyGetter={(row) => row.id}
        rows={boxes.map((b) => ({
          id: b.id,
          name: b.name,
          '#uniquePatches': b['#uniquePatches'],
          '#bags': b.bags?.length,
          '#patches': b['#patches'],
        }))}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
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
