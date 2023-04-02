import { Input } from '@mantine/core';
import { Button } from '../Button/Button';
import { CreatorHandler } from '../CreatorHandler/CreatorHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useMemo, useState } from 'react';
import { IPerson } from '../../types/definitions';
import { v4 as uuid } from 'uuid';

type Donation = {
  id: string;
  patchId: number;
  personId: number | undefined;
  amount: number;
};

type DonationHandlerProps = {
  patchId: number;
  persons: IPerson[];
  onCreate: (query: string) => Promise<IPerson>;
};

export const DonationHandler: React.VFC<DonationHandlerProps> = (props) => {
  const { patchId, persons, onCreate } = props;
  const [donations, setDonations] = useState<Donation[]>([]);

  const addNew = useCallback(
    () =>
      setDonations([
        ...donations,
        {
          amount: 1,
          id: uuid(),
          patchId,
          personId: undefined,
        },
      ]),
    [donations, patchId]
  );

  const onRemove = useCallback(
    (id: string) => setDonations(donations.filter((x) => x.id !== id)),
    [donations]
  );

  const onChange = useCallback(
    (donationId: string, data: Donation) => {
      const index = donations.findIndex((x) => x.id === donationId);
      const newData = [...donations];
      newData.splice(index, 1, data);
      setDonations(newData);
    },
    [donations, setDonations]
  );

  const onSelectPerson = useCallback(
    (donationId: string, values: string[]) => {
      onChange(donationId, {
        ...donations.find((x) => x.id === donationId)!,
        personId: parseInt(values[0]),
      });
    },
    [donations, setDonations]
  );

  const disabled =
    donations.some((x) => !x.personId) ||
    Object.values<number>(
      donations
        .map((x) => x.personId)
        .reduce(
          (acc, val) => ({
            ...acc,
            [`${val}`]: (acc[`${val}`] || 0) + 1,
          }),
          {}
        )
    ).some((x: number) => x > 1);

  return (
    <div>
      {donations.map((d) => (
        <div
          key={'donation-' + d.id}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <CreatorHandler
            multiSelect={false}
            data={persons}
            disabled={false}
            onCreate={onCreate}
            selected={d.personId ? [d.personId.toString()] : []}
            setSelected={(data) => onSelectPerson(d.id, data)}
          />
          <input
            type="number"
            min={1}
            style={{ flexBasis: 1, margin: '0 15px' }}
            onChange={(e) =>
              onChange(d.id, { ...d, amount: parseInt(e.target.value) })
            }
          />
          <FontAwesomeIcon
            icon={faTrash}
            style={{ cursor: 'pointer' }}
            onClick={() => onRemove(d.id)}
          />
        </div>
      ))}

      <Button label="Lägg till donation" onClick={addNew} disabled={disabled} />
    </div>
  );
};
