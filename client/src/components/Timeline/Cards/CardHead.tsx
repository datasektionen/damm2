import React from 'react';
import {
  StyledCardHead,
  Date,
  Day,
  Month,
  H2,
  Arrow,
  ArrowPoint,
} from './style';
import { formatDay, formatMonthShort } from '../../../common/dates';
import { useAppContext } from '../../../hooks/useAppContext';

interface Props {
  id: number;
  title: string;
  index: number;
  date: string;
  type: string;
  onEditClick: (id: number) => void;
  createdBy: string;
}

export const CardHead: React.FC<Props> = ({
  id,
  title,
  type,
  index,
  date,
  onEditClick,
  createdBy,
}) => {
  const { admin, user } = useAppContext();
  const isAdmin = admin.includes('prylis') || admin.includes('admin');

  return (
    <StyledCardHead index={index}>
      <Date>
        <Day>{formatDay(date)}</Day>
        <Month>{formatMonthShort(date)}</Month>
      </Date>
      <H2>{title}</H2>
      {type !== 'DFUNKT' &&
        (isAdmin || (user === createdBy && admin.includes('post'))) && (
          <i
            className="fas fa-edit"
            onClick={() => onEditClick(id)}
            title="Redigera"
          />
        )}
      <Arrow index={index} />
      <ArrowPoint index={index} />
    </StyledCardHead>
  );
};
