import React from 'react';
import { StyledHeader, Logo, H1, H2 } from './style';
import logo from '../../skold.png'

interface Props {
  children?: React.ReactNode;
}

// export const FancyHeader: React.FC = props => {
//   return (
//     <StyledHeader>
//       <div>
//         <Logo src={logo} alt="Datasektionens sköld" className="Logo" />
//         <H1>Konglig Datasektionens</H1>
//         <H2>Märkesarkiv</H2>
//         {props.children}
//       </div>
//     </StyledHeader>
//   )
// }

export const FancyHeader = React.forwardRef<HTMLDivElement>((props: Props, ref) => (
  <StyledHeader ref={ref}>
    <div>
      <Logo src={logo} alt="Datasektionens sköld" className="Logo" />
      <H1>Konglig Datasektionens</H1>
      <H2>Märkesarkiv</H2>
      {props.children}
    </div>
  </StyledHeader>
))