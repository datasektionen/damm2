import styled from '@emotion/styled';

export const StyledColorRandomizer = styled.span({
    // border: "solid 1px black",
    borderRadius: "100%",
    padding: "10px",
    fontSize: "20px",
    cursor: "pointer",
    width: "50px",
    height: "50px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ":hover": {
        transform: "scale(1.1)"
    }
},
    (props: any) => ({
        backgroundColor: props.backgroundColor ?? "#fff",
        color: props.color ?? "#000"
    })
)