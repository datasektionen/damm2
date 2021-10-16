import styled from '@emotion/styled';
import FlipMove from 'react-flip-move';
import { maxWidth } from '../../common/Theme';

export const SMALL_BREAKPOINT = 1100;

export const StyledPatchArchive = styled.div({
    display: "flex",
    flexWrap: "wrap",
    minHeight: "500px",
    padding: "10px 0px",
    // Jävla aurora
    "*": {
        transition: "none"
    },
    position: "relative",
});

export const StyledPatchArchiveDivider = styled.div({
    display: "flex",
    width: "100%",
    position: "relative",

    [maxWidth(SMALL_BREAKPOINT)]: {
        flexDirection: "column-reverse",
    },
})

export const StyledFlipMove = styled(FlipMove)({
    display: "grid",
    width: "100%",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
})

export const Centered = styled.div({
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "grey",
})

export const Left = styled.div({
    width: "100%",
    [maxWidth(SMALL_BREAKPOINT)]: {
        alignSelf: "flex-end",
        justifySelf: "flex-end"
    },
})

export const Right = styled.div({
    width: "100%",
})

export const StyledFlipMoveDetails = styled(FlipMove)({
    height: "100%",
})