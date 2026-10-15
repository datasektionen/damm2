import React from 'react';
import ReactMarkdown from 'react-markdown';
import { StyledAnniversary, Head, HeadArrow, Node } from './style';
import { formatLongDate, getYear } from '../../../../common/dates';
import { useAppContext } from '../../../../hooks/useAppContext';
import { newTabLinks } from '../../../../common/markdown';

interface Props {
  id: number;
  index: number;
  title: string;
  date: string;
  content: string;
  onEditClick: (id: number) => void;
  createdBy: string;
}

export const Anniversary: React.FC<Props> = ({
  id,
  index,
  title,
  date,
  content,
  onEditClick,
  createdBy,
}) => {
  const { admin, user } = useAppContext();
  const isAdmin = admin.includes('prylis') || admin.includes('admin');

  return (
    <StyledAnniversary key={'card-' + getYear(date) + '-' + index}>
      <Node index={index} />
      <HeadArrow index={index} />
      <Head index={index}>
        <h2>{title}</h2>
        {(isAdmin || (user === createdBy && admin.includes('post'))) && (
          <i
            className="fas fa-edit"
            onClick={() => onEditClick(id)}
            title="Redigera"
          />
        )}
      </Head>
      <time>{formatLongDate(date)}</time>
      <i className="fa fa-star" />
      {content ? (
        <ReactMarkdown components={newTabLinks}>{content}</ReactMarkdown>
      ) : null}
    </StyledAnniversary>
  );
};
