import styled from '@emotion/styled'

export const StyledCheckbox = styled.div({
    userSelect: "none",
    width: "240px",
    maxWidth: "100%",
    height: "30px",
    position: "relative",
    margin: "10px 0 -10px",
    color: "#ec5f99",
    marginLeft: "40px"
})

export const StyledInput = styled.input({
    display: "none",
    position: "absolute",
    marginLeft: "-20px",
    margin: "4px 0 0",
    lineHeight: "normal",
    padding: 0,
})

export const Label = styled.label({
    position: "absolute",
    left: "12px",
    top: 0,
    cursor: "pointer",
    minHeight: "20px",
    paddingLeft: "10px",
    marginBottom: 0,
    fontWeight: 400,
})

export const Box = styled.div({
    cursor: "pointer",
    position: "absolute",
    width: "25px",
    height: "25px",
    top: "-2px",
    left: "-12px",
    float: "left",
    border: "1px solid #ddd",
    boxShadow: "inset 0 2px 3px rgb(0, 0, 0, 0.1)",
    
},
    (props: any) => ({
        background: props.checked ? "#ec5f99" : "#fff"
    })
)

export const BoxCheck = styled.div({
    opacity: 1,
    position: "absolute",
    width: "13px",
    height: "8px",
    background: "transparent",
    top: "4px",
    left: "-6px",
    border: "3px solid #fff",
    borderTop: "none",
    borderRight: "none",
    transition: ".1s",
    transform: "rotate(-45deg)",
})