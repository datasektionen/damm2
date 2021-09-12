import styled from '@emotion/styled';

const StyledAlert = styled.div({
    borderRadius: "10px",
    padding: "15px",
    wordBreak: "break-word",
    margin: "10px",
})

export const SuccessAlert = styled(StyledAlert)({
    backgroundColor: "#d4edda",
    color: "#155724",
    border: "solid 1px #c3e6cb",
})

export const ErrorAlert = styled(StyledAlert)({
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "solid 1px #f5c6cb",
})