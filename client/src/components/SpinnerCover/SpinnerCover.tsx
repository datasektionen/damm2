import React from 'react';
import { Spinner } from '../Spinner/Spinner';

import { StyledSpinnerCover } from './style';

export const SpinnerCover: React.FC = () => {
  return (
    <StyledSpinnerCover>
      <Spinner />
    </StyledSpinnerCover>
  );
};
