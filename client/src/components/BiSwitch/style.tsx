import styled from '@emotion/styled'
import Theme from '../../common/Theme'

export const StyledBiSwitch = styled.div({
    height: "25px",
    display: "flex",
    alignItems: "center",
})

const gray = "#DDDDDD"

export const Area = styled.div({
    position: "relative",
    width: "40px",
    height: "20px",
    backgroundColor: Theme.palette.cerise,
    borderRadius: "10px",
    cursor: "pointer",
    margin: "0 5px"
},
    (props: any) => ({
        backgroundColor: props.on ? Theme.palette.cerise : gray,
        border: `solid 2px ${props.on ? Theme.palette.cerise : gray}`,
    })
)

export const Indicator = styled.div({
    position: "relative",
    transition: "all 0.3s ease-in-out",
    width: "16px",
    height: "100%",
    borderRadius: "50%",
    backgroundColor: "#fff",
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