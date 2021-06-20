import styled from '@emotion/styled';
import { maxWidth } from '../../common/Theme';

export const StyledTimeline = styled.div({

})

export const TimelineBody = styled.div({
    margin: "0 50px 100px 0",
})

export const Cards = styled.div({
    position: "relative",
    margin: "auto",
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "flex-start",
    maxWidth: "1200px",
    paddingTop: "50px",

    [maxWidth(900)]: {
        paddingTop: "0px"
    },
    [maxWidth(600)]: {
        paddingTop: "0px"
    },
})

export const CardWrapper = styled.div({
    width: "50%",
    position: "relative",

    [maxWidth(900)]: {
        width: "100%",
        paddingRight: "40px",
        margin: 0,
        left: "40px"
    },

    [maxWidth(600)]: {
        paddingRight: "0px",
        left: "20px",
        right: "-5px"
    }
},
    (props: any) => {
        return {
            margin: props.index % 2 === 0 ? "0 0 50px 0 " : "50px 0 0 0",
        }
    }
)

export const Line = styled.div({
    zIndex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    borderLeft: "1px solid #aaa",

    [maxWidth(900)]: {
        left: "40px",
    },
    [maxWidth(600)]: {
        left: "20px",
    },
})

const LineDelimiter = styled.div({
    zIndex: 2,
    position: "absolute",
    width: "20px",
    height: "2px",
    boxShadow: "0 0 2px 8px #eee",
    backgroundColor: "#aaa",
    left: "calc(50% - 9px)",

    [maxWidth(900)]: {
        left: "30px",
    },
    
    [maxWidth(600)]: {
        left: "13px",
        width: "15px",
        height: "2px",
    },
})

export const LineEnd = styled(LineDelimiter)({
    bottom: 0,
})

export const LineStart = styled(LineDelimiter)({
    top: 0,
})

export const Year = styled.time({
    margin: "20px auto",
    fontSize: "3em",
    textAlign: "center",
    display: "block",
    userSelect: "none",

    [maxWidth(900)]: {
        margin: "20px 40px",
        textAlign: "left"
    },
    [maxWidth(600)]: {
        margin: "10px 20px",
        fontSize: "2em"
    },
})