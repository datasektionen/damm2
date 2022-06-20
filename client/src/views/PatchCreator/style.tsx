import styled from '@emotion/styled';
import Theme, { maxWidth, px } from '../../common/Theme';

export const StyledPatchCreator = styled.div({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
    paddingBottom: "100px",

    [maxWidth(700)]: {
        paddingBottom: "0px"
    }
})

export const Row = styled.div({
    width: "100%",
    display: "flex",
    justifyContent: "center"
})

export const ImagePreview = styled.img({
    width: "250px",
    height: "250px",
    objectFit: "contain",
    userSelect: "none",
    justifyContent: "center",
    display: "flex",
    alignItems: "center"
})

export const Content = styled.div({
    minWidth: "60%",
    backgroundColor: "#fff",
    padding: "50px",

    "> input, textarea": {
        width: "60%"
    },

    [maxWidth(700)]: {
        minWidth: "100%",
        maxWidth: "100%",
        padding: "40px 20px",
        "> input, textarea": {
            width: "100%"
        },
    }
})

export const H3 = styled.h3({

})

export const H4 = styled.h4({
    color: "#757575",
    fontSize: "1em",
    fontWeight: 300,
    marginTop: "-3px",
})

export const BRow = styled.div({
    "> button": {
        marginRight: "10px"
    }
})

export const StyledRequired = styled.span({
    color: "red",
})