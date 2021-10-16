import styled from '@emotion/styled';
import { maxWidth } from '../../../common/Theme';

export const StyledScrollLegend = styled.div({
    position: "fixed",
    width: "50px",
    right: 0,
    // top: "50px",
    top: 0,
    bottom: 0,
    background: "rgba(255, 255, 255, 0.5)",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    zIndex: 100000,
    userSelect: "none",

    [maxWidth(600)]: {
        width: 0,
        
    },
})

export const Year = styled.div({
	position: "fixed",
	color: "rgba(0, 0, 0, 0.5)",
	width: "50px",
	textAlign: "center",
	fontSize: "0.75em",
	cursor: "pointer",
	zIndex: 3,
},
    (props: any) => ({
        // top: `calc(${props.position} + 25px)`
        top: props.position
    })
)

export const Scroller = styled.div({
	transition: "all 0s",
	right: 0,
	position: "fixed",
	color: "rgba(0, 0, 0, 0.5)",
	width: "90px",
	textAlign: "center",
	fontSize: "1.25em",
	cursor: "move",
	zIndex: 5,
	background: "#fff",
	boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
	borderRadius: "2px",
	padding: "0 20px 0 10px",
	height: "50px",
	lineHeight: "50px",
    touchAction: "none",

    [maxWidth(900)]: {
		width: "70px",
		fontSize: "1em",
		padding: "0 10px",
    },

    [maxWidth(600)]: {
		width: "40px",
		height: "40px",
		lineHeight: "40px",
		textAlign: "center",
		right: "-10px",
		fontSize: "0.75em",
		fontWeight: 900,
		padding: "0 5px",
		borderRadius: "30px",
		marginRight: "10px",
    }

},
    (props: any) => ({
        top: props.position
    })
)
