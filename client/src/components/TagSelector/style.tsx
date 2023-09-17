import styled from '@emotion/styled';
import FlipMove from 'react-flip-move';
import { maxWidth } from '../../common/Theme';

export const StyledTagSelector = styled.div({
    display: "flex",
    flexWrap: "wrap",
    padding: "25px 15px",
    width: "100%"
})

export const StyledFlipMove = styled(FlipMove)({
    display: "flex",
    flexWrap: "wrap",
    padding: "25px 15px",
    width: "100%",

    [maxWidth(600)]: {
        padding: "25px 0px"
    }
})