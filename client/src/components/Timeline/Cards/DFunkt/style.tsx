import styled from '@emotion/styled';
import Theme, { maxWidth } from '../../../../common/Theme';

const DEFAULT_PICTURE = '/images/default-avatar.svg';

export const StyledDFunkt = styled.div({});

export const Users = styled.div({
  margin: '-10px -20px',
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'flex-start',
  marginBottom: '10px',

  [maxWidth(600)]: {
    margin: '5px -15px',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'flex-start',
    marginBottom: '10px',
  },
});

export const User = styled.div(
  {
    margin: 0,
    height: '74.25px',
    width: '74.25px',
    display: 'inline-block',
    backgroundSize: 'cover',
    backgroundColor: '#eee',

    [maxWidth(900)]: {
      height: '10vw',
      width: '10vw',
    },
  },
  (props: any) => ({
    // Default is layered underneath so it also shows if the picture URL fails to load
    backgroundImage: props.picture
      ? `url(${props.picture}), url(${DEFAULT_PICTURE})`
      : `url(${DEFAULT_PICTURE})`,
  })
);
