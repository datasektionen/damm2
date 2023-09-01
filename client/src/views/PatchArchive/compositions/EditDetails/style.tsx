import styled from '@emotion/styled';
import Theme, { maxWidth } from '../../../../common/Theme';

export const StyledEditDetails = styled.div({
    width: "100%",
    height: "100%",
    position: "relative",
})

export const Image = styled.img({
    maxHeight: "300px",
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

export const DeleteBox = styled.div({
    width: "100%",
    border: `solid 1px ${Theme.palette.red}`,
    borderRadius: "5px",
    margin: "10px 0",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
})

export const DeleteCenter = styled.div({
    display: "flex",
    justifyContent: "center",
    padding: "10px 0",
})