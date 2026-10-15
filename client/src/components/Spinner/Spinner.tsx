import React from 'react';
import { StyledSpinner } from './style';
import spinner from '../../spinner.svg';

export const Spinner: React.FC = () => {
  return (
    <>
      <StyledSpinner src={spinner} draggable={false} />
    </>
  );
};
