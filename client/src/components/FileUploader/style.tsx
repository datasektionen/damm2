import styled from '@emotion/styled';

export const StyledFileUploader = styled.div({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "20px 0px",
})

export const Row = styled.div({
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    "> button": {
        minWidth: "110px"
    }
})

export const Label = styled.span({
    marginLeft: "10px"
})

export const File = styled.div({
    wordBreak: "break-all",
    "> i": {
        marginLeft: "5px",
        color: "red",
        cursor: "pointer",
    }
})


export const Files = styled.div({
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
})