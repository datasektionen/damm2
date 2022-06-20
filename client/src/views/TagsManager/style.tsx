import styled from '@emotion/styled';
import Theme, { maxWidth, px } from '../../common/Theme';

export const StyledTagManager = styled.div({
    display: "flex",
    justifyContent: "center",
    position: "relative",
})

export const Content = styled.div({
    display: "flex",
    flexDirection: "column",
    maxWidth: px(Theme.sizes.maxContainerWidth),
    // minWidth: "60%",
    width: "100%",
    backgroundColor: "#fff",
    padding: "50px",
    

    [maxWidth(700)]: {
        minWidth: "100%",
        maxWidth: "100%",
        padding: "40px 20px"
    }
})