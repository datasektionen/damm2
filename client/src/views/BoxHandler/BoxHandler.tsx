import http, { errorMessage } from '../../common/api';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from '../../components/Alert/Alert';
import { Button } from '../../components/Button/Button';
import { Field } from '../../components/Field/Field';
import { Box } from '../../types/definitions';
import { BoxDataGrid } from '../StorageHandler/compositions/BoxDataGrid';

export const BoxHandler = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [boxName, setBoxName] = useState('');
  const [isCreatingBox, setIsCreatingBox] = useState(false);
  const [error, setError] = useState('');

  const createBox = useCallback(async () => {
    setIsCreatingBox(true);
    setError('');
    http
      .post<{ body: Pick<Box, 'id' | 'name'> }>('/api/storage/box/create', {
        name: boxName,
      })
      .then((res) => {
        setBoxes((boxes) => [
          ...boxes,
          { ...res.data.body, '#patches': 0, '#uniquePatches': 0, bags: [] },
        ]);
        setBoxName('');
      })
      .catch((err) => {
        setError(errorMessage(err, 'Kunde inte skapa lådan'));
      })
      .finally(() => {
        setIsCreatingBox(false);
      });
  }, [boxName]);

  const getBoxes = useCallback(() => {
    http.get<{ body: Box[] }>('/api/storage/box/all').then((res) => {
      setBoxes(res.data.body);
    });
  }, []);

  useEffect(getBoxes, [getBoxes]);

  return (
    <>
      <h3>Skapa box</h3>
      {error.length !== 0 && <Alert type="error">{error}</Alert>}
      <Field
        placeholder="Namn"
        value={boxName}
        onChange={(e) => setBoxName(e.target.value)}
      />
      <Button
        label="Skapa"
        onClick={createBox}
        disabled={boxName.length === 0}
        isLoading={isCreatingBox}
      />
      <BoxDataGrid boxes={boxes} setBoxes={setBoxes} />
    </>
  );
};
