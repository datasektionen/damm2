import styled from '@emotion/styled';

export const StyledCreatorHandler = styled.div({
  margin: '20px 0px',
});

export const Creator = styled.div<{ disabled?: boolean }>(
  {
    margin: '5px',
    wordBreak: 'break-all',
    '> i': {
      color: 'red',
      marginLeft: '5px',
    },
  },
  (props) => ({
    cursor: props.disabled ? 'initial' : 'pointer',
  })
);

export const CreatorsList = styled.div({
  margin: '20px 0px',
});
