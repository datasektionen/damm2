import styled from '@emotion/styled';
import { AnimatedList } from '../AnimatedList/AnimatedList';
import { maxWidth } from '../../common/Theme';

export const StyledTagSelector = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  padding: '25px 15px',
  width: '100%',
});

export const AnimatedTags = styled(AnimatedList)({
  display: 'flex',
  flexWrap: 'wrap',
  padding: '25px 15px',
  width: '100%',

  [maxWidth(600)]: {
    padding: '25px 0px',
  },
});
