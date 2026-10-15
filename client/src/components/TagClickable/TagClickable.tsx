import React from 'react';
import { StyledTagClickable } from './style';
import { ITag } from '../../types/definitions';

interface Props {
  tag: ITag;
  clicked: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
}

export const TagClickable: React.FC<Props> = ({
  tag,
  clicked,
  onClick,
  disabled,
}) => {
  return (
    <StyledTagClickable
      onClick={onClick}
      clicked={clicked}
      tag={tag}
      disabled={disabled}
      title={
        tag.description.length === 0 ? 'Ingen beskrivning' : tag.description
      }
    >
      <span>{tag.name}</span>
      {clicked ? <i className="fas fa-check" /> : <i className="fas fa-plus" />}
    </StyledTagClickable>
  );
};
