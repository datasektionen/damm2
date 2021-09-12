import styled from '@emotion/styled';

export const StyledTag = styled.div({
    userSelect: "none",
    padding: "5px 10px 5px 10px",
    borderRadius: "2px",
    textAlign: "center",
    margin: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    color: "black",

    ":hover": {
        transform: "scale(1.03)",
    },
},
    (props: any) => ({
        color: props.color,
        backgroundColor: props.backgroundColor,
    })
)