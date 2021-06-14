import styled from '@emotion/styled';

export const StyledTagEditor = styled.div({
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column"
})

export const HeadTags = styled.div({
    display: "flex",
    flexWrap: "wrap"
})

export const SubTags = styled.div({
    display: "flex",
    flexWrap: "wrap"
})

export const Editor = styled.div({
    display: "flex",
    flexDirection: "column"
})

export const Color = styled.div({
    display: "flex",
    "> input": {
        width: "50px",
        height: "50px",
        marginRight: "15px",
        cursor: "pointer",
    }
})

export const Row = styled.div({
    marginTop: "20px",
    display: "flex",
    flexWrap: "wrap",
    "> button": {
        marginRight: "10px"
    }
})