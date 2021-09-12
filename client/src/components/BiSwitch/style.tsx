import styled from '@emotion/styled'
import Theme from '../../common/Theme'

export const StyledBiSwitch = styled.div({
    height: "25px",
    display: "flex",
    alignItems: "center",
})

export const Area = styled.div({
    position: "relative",
    width: "40px",
    height: "20px",
    backgroundColor: Theme.palette.cerise,
    borderRadius: "10px",
    border: `solid 2px ${Theme.palette.cerise}`,
    cursor: "pointer",
    margin: "0 5px"
})

export const Indicator = styled.div({
    position: "relative",
    transition: "all 0.3s ease-in-out",
    width: "16px",
    height: "100%",
    borderRadius: "50%",
    backgroundColor: "#eee",
},
    (props: any) => ({
        left: props.left ? 0 : "calc(100% - 16px)",
    })
)

export const Text = styled.span({
},
    (props: any) => ({
        color: props.highlighted ? Theme.palette.cerise : "#333",
        fontWeight: "bold"
    })
)