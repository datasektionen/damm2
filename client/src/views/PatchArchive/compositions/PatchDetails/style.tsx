import styled from '@emotion/styled';
import { SMALL_BREAKPOINT } from '../../style';
import Theme, { maxWidth } from '../../../../common/Theme';

export const StyledPatchDetails = styled.div({
    display: "flex",
    flexDirection: "row",
    boxShadow: "0 2px 5px rgba(0,0,0,.2)",
    padding: "45px 25px",
    margin: "0px 0px 0px 15px",
    position: "sticky",
    overflowY: "auto",
    maxHeight: "90vh",
    top: "50px",
    backgroundColor: "#fff",

    [maxWidth(SMALL_BREAKPOINT)]: {
        margin: "0px 0px 15px 0px",
    },

    [maxWidth(600)]: {
        flexDirection: "column",
    },
})

export const PatchImage = styled.img({
    cursor: "pointer",
    userSelect: "none",
    backgroundColor: "#eee",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    border: "solid 3px white",
    borderRadius: "5px",

    ":hover": {
        transform: "scale(1.01)",
        border: `solid 3px ${Theme.palette.cerise}`
    },
})

export const CloseButton = styled.div({
    position: "absolute",
    fontSize: "30px",
    cursor: "pointer",
    right: "20px",
    top: "20px",
    color: "red",

    [maxWidth(600)]: {
        right: "5px",
        top: "5px"
    },
})

export const Left = styled.div({
    width: "100%",
    display: "flex",
    flexDirection: "column",

    "> button": {
        margin: "10px 0px"
    },
})

export const Right = styled.div({
    margin: "10px 10px 10px 20px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",

    [maxWidth(600)]: {
        margin: 0,
    },
})

export const Meta = styled.div({
    color: "#00000099",
    "> span i": {
        margin: "0px 5px",
    },
    marginBottom: "20px",
})

export const Content = styled.div({
    display: "flex",
    height: "100%",
    flexDirection: "column",
})

export const Description = styled.div({
    whiteSpace: "pre-wrap",
    marginBottom: "25px",
    paddingBottom: "25px",
    borderBottom: "solid 1px #afafaf4f",
})

export const Tags = styled.div({
    display: "flex",
    flexWrap: "wrap",
})

export const Files = styled.div({
    display: "flex",
    flexDirection: "column",
})

export const Creators = styled.span({
    wordBreak: "break-word"
})

export const Thrash = styled.span({
    marginLeft: "5px",
    cursor: "pointer",
})

export const H1 = styled.h1({
    wordBreak: "break-all",
})