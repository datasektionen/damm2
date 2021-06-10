import styled from '@emotion/styled';

export const StyledTextArea = styled.textarea({
    boxShadow: "inset 0 2px 3px rgb(0 0 0 / 10%)",
    padding: "10px",
    border: "1px solid #f7f7f7",
    maxWidth: "100%",
    minHeight: "150px",
},
    (props: any) => ({
        resize: props.resize ?? "none",
        width: props.width ? props.width : "500px",
    })
)