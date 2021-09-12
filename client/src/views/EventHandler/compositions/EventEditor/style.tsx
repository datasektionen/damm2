import styled from '@emotion/styled';

export const StyledEventEditor = styled.div({
    display: "flex",
    flexDirection: "column",
    position: "relative",

    "textarea": {
        width: "100%",
    },
    "input": {
        margin: "0px 0px 10px",
    },
    "select": {
        margin: "0px 0px 10px",
        height: "50px",
    }
})

export const Row = styled.div({
    display: "flex"
})

export const BRow = styled(Row)({
    justifyContent: "center",
    flexWrap: "wrap",
    "button": {
        marginRight: "5px"
    }
})

export const H4 = styled.h4({
    margin: "10px 0px 0px"
})