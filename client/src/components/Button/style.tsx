import styled from '@emotion/styled';
import Theme from '../../common/Theme';

export const StyledButton = styled.button<{
  isLoading?: boolean;
  backgroundColor?: string;
  color?: string;
}>(
  {
    height: '42px',
    userSelect: 'none',
  },
  (props) => ({
    backgroundColor: props.isLoading
      ? ''
      : (props.backgroundColor ?? Theme.palette.yellow),
    color: props.color ?? Theme.palette.blackgrey,

    '&:disabled': {
      cursor: 'not-allowed',
      backgroundColor: Theme.palette.taggrey,
      color: Theme.palette.blackgrey,
    },
  })
);

export const Loading = styled.img({
  width: '20px',
  height: '20px',
});
