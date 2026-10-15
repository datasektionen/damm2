import React from 'react';
import ReactMarkdown from 'react-markdown';
import { StyledGeneral } from './style';
import { CardHead } from '../CardHead';
import { newTabLinks } from '../../../../common/markdown';

interface Props {
  id: number;
  index: number;
  content: string;
  title: string;
  date: string;
  onEditClick: (id: number) => void;
  createdBy: string;
  children?: React.ReactNode;
}

export const General: React.FC<Props> = ({
  id,
  index,
  content,
  title,
  date,
  children,
  onEditClick,
  createdBy,
}) => {
  return (
    <StyledGeneral>
      <CardHead
        id={id}
        title={title}
        type="GENERAL"
        date={date}
        index={index}
        onEditClick={onEditClick}
        createdBy={createdBy}
      />
      {children}
      {content ? (
        <ReactMarkdown components={newTabLinks}>{content}</ReactMarkdown>
      ) : null}
    </StyledGeneral>
  );
};
