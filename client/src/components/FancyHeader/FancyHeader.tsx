import React from 'react';
import { StyledHeader, Logo, H1, H2 } from './style';
import logo from '../../skold.png'

interface Props {
  children?: React.ReactNode;
  title: string;
}

export const FancyHeader: React.FC<Props> = ({ title, children }) => {
  return (
    <StyledHeader>
      <div>
        <Logo src={logo} alt="Datasektionens sköld" />
        <H1>Konglig Datasektionens</H1>
        <H2>{title}</H2>
        {children}
      </div>
    </StyledHeader>
  )
}