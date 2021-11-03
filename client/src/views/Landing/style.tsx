import styled from '@emotion/styled';

export const StyledLanding = styled.div({

})

export const Pick = styled.div({
    background: "#ec5f99",
    width: "100%",
    color: "#fff",
    padding: "30px 0 30px",
    boxShadow: "0 2px 5px rgb(0 0 0 / 20%)",
    // height: "300px",
})

export const Alternatives = styled.ul({
    listStyleType: "none",
    margin: "0 auto",
    maxWidth: "900px",
    padding: "0",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
})

export const Alternative = styled.li({
    width: "33.33%",
    minWidth: "200px",
    float: "left",

    "a": {
        width: "100%",
        display: "block",
        color: "#fff",
        padding: "32px",
        fontSize: "2em",
        textAlign: "center",
    },

    "i": {
        transition: "all 0.1s",
        background: "#e83d84",
        width: "100px",
        height: "100px",
        lineHeight: "100px",
        borderRadius: "50px",
    },

    ":hover i": {
        boxShadow: "0 2px 5px rgb(0 0 0 / 20%)"
    }
})

export const Icon = styled.span({
    display: "block",
})

export const Desc = styled.span({
    textTransform: "uppercase",
    fontSize: "0.75em",
    fontWeight: 300,
    marginTop: "20px",
    display: "block",
})
