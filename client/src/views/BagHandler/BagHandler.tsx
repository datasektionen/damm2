import http, { errorMessage } from '../../common/api';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from '../../components/Alert/Alert';
import { Button } from '../../components/Button/Button';
import { Field } from '../../components/Field/Field';
import { Bag, Box } from '../../types/definitions';
import { BagDataGrid } from '../StorageHandler/compositions/BagDataGrid';

export const BagHandler = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [bags, setBags] = useState<Bag[]>([]);
  const [bagName, setBagName] = useState('');
  const [isCreatingBag, setIsCreatingBag] = useState(false);
  const [selectedBoxState, setSelectedBox] = useState('');
  const [error, setError] = useState('');

  // Default to the first box until the user picks one
  const selectedBox =
    selectedBoxState || (boxes.length !== 0 ? `${boxes[0].id}` : '');

  const createBag = useCallback(() => {
    const box = boxes.find((b) => `${b.id}` === selectedBox);
    if (!box) return;
    setIsCreatingBag(true);
    setError('');

    http
      .post<{ body: Omit<Bag, 'box' | '#patches' | '#uniquePatches'> }>(
        '/api/storage/bag/create',
        {
          name: bagName,
          boxId: box.id,
        }
      )
      .then((res) => {
        setBags((bags) =>
          [
            ...bags,
            {
              ...res.data.body,
              '#patches': 0,
              '#uniquePatches': 0,
              box: { id: box.id, name: box.name },
            },
          ].sort((a, b) =>
            a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
          )
        );
        setBagName('');
      })
      .catch((err) => {
        setError(errorMessage(err, 'Kunde inte skapa påsen'));
      })
      .finally(() => {
        setIsCreatingBag(false);
      });
  }, [bagName, selectedBox, boxes]);

  const getBoxes = useCallback(() => {
    http.get<{ body: Box[] }>('/api/storage/box/all').then((res) => {
      setBoxes(res.data.body);
    });
  }, []);

  const getBags = useCallback(() => {
    http.get<{ body: Bag[] }>('/api/storage/bag/all').then((res) => {
      setBags(res.data.body);
    });
  }, []);

  useEffect(getBoxes, [getBoxes]);
  useEffect(getBags, [getBags]);

  return (
    <>
      <h3>Skapa påse</h3>
      {error.length !== 0 && <Alert type="error">{error}</Alert>}
      <Field
        placeholder="Namn"
        value={bagName}
        onChange={(e) => setBagName(e.target.value)}
      />
      <select
        value={selectedBox}
        onChange={(e) => setSelectedBox(e.target.value)}
      >
        {boxes.map((b) => (
          <option key={'box-' + b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
      <Button
        label="Skapa"
        onClick={createBag}
        disabled={bagName.length === 0 || !selectedBox}
        isLoading={isCreatingBag}
      />
      <div style={{ borderBottom: 'solid 1px #afafaf4f', padding: '10px' }} />
      <BagDataGrid bags={bags} boxes={boxes} setBags={setBags} />
    </>
  );
};
