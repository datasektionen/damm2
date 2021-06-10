import styled from '@emotion/styled';
import { maxWidth } from '../../../../common/Theme';

export const StyledEditDetails = styled.div({
    width: "100%",
    position: "relative",
})

export const Image = styled.img({
    width: "200px",
    height: "200px",
    userSelect: "none",
})

export const Row = styled.div({
    display: "flex"
})

export const BRow = styled(Row)({
    display: "flex",
    flexWrap: "wrap",
    padding: "20px 0px",
    justifyContent: "center",
    "> button": {
        marginRight: "10px"
    },

    [maxWidth(600)]: {
        
    }
})

export const H1 = styled.h1({
    margin: "0px 0px 10px 0px"
})

export const H4 = styled.h4({
    // margin: "0px 0px 10px 0px"
})