import styled from '@emotion/styled';
import FlipMove from 'react-flip-move';
import Theme, { maxWidth, px } from '../../common/Theme';

export const StyledEventHandler = styled.div({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
})

export const Content = styled.div({
    boxShadow: "0 2px 5px rgb(0 0 0 / 20%)",
    maxWidth: px(Theme.sizes.maxContainerWidth),
    minWidth: "70%",
    backgroundColor: "#fff",
    padding: "50px",

    [maxWidth(1000)]: {
        minWidth: "100%",
        maxWidth: "100%",
        padding: "40px 20px",
    }
})
