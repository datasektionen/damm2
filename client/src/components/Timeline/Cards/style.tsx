import styled from '@emotion/styled';
import Moment from 'react-moment';
import Theme, { maxWidth } from '../../../common/Theme';

export const StyledCardHead = styled.div({
    display: "flex",
    minHeight: "50px",
    background: "#f9f9f9",
    borderBottom: "1px solid #eee",
    margin: "-20px -20px 10px",
    wordBreak: "break-all",
    position: "relative",

    "> i": {
        position: "absolute",
        top: "calc(50% - 8px)",
        cursor: "pointer",
    },

    "> i:hover": {
        transform: "scale(1.2)"
    }
},
    (props: any) => ({
        flexDirection: props.index % 2 === 0 ? "row" : "row-reverse",

        "> i": {
            right: props.index % 2 === 0 ? "auto" : "-25px",
            left: props.index % 2 === 0 ? "-25px" : "auto",
        },

        [maxWidth(900)]: {
            flexDirection: "row-reverse",

            "> i": {
                right: "-25px",
                left: "auto"
            },
        },

        [maxWidth(600)]: {
            minHeight: "40px",
            margin: "-15px -15px -5px",
        }
    })
)

export const Arrow = styled.div({
    position: "absolute",
    width: 0,
    height: 0,
    borderTop: "25px solid transparent",
    borderBottom: "25px solid transparent",
},
    (props: any) => ({
        right: props.index % 2 === 0 ? "-25px" : "auto",
        borderLeft: props.index % 2 === 0 ? "25px solid #f9f9f9" : "none",
        left: props.index % 2 === 0 ? "auto" : "-25px",
        borderRight: props.index % 2 === 0 ? "none" : "25px solid #f9f9f9",

        [maxWidth(900)]: {
            left: "-25px",
            borderRight: "25px solid #f9f9f9",
            borderLeft: "none",
        },

        [maxWidth(600)]: {
            display: "none"
        }
    })
)

export const ArrowPoint = styled.div({
    position: "absolute",
    width: "4px",
    height: "4px",
    backgroundColor: "#aaa",
    borderRadius: "5px",
    boxShadow: "0 0 2px 8px #eee",
    zIndex: 2,
    top: "25px",
},
    (props: any) => ({

        right: props.index % 2 === 0 ? "-42px" : "auto",
        left: props.index % 2 === 0 ? "auto" : "-42px",

        [maxWidth(900)]: {
            left: "-42px",
            right: "auto"
        },

        [maxWidth(600)]: {
            left: "-21px",
        }
    })
)

export const H2 = styled.h2({
    padding: 0,
    display: "inline-block",
    fontSize: "1.2em",
    margin: "14px 20px",
    width: "100%",

    [maxWidth(600)]: {
        margin: "10px 15px 0",
    }
})

export const Date = styled.div({
    fontWeight: 300,
    background: Theme.palette.cerise,
    color: "#fff",
    minWidth: "50px",
    minHeight: "50px",
    maxWidth: "50px",
    maxHeight: "50px",
    textAlign: "center",
    lineHeight: 1,
    display: "flex",
    flexFlow: "column wrap",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",

    [maxWidth(600)]: {
        minWidth: "40px",
        minHeight: "40px",
        maxHeight: "40px",
        maxWidth: "100px",
        height: "40px",
        display: "block",
        width: "70px",
        lineHeight: "40px",
        padding: "0 3px",
    },
})

export const Day = styled(Moment)({
    width: "100%",

    [maxWidth(600)]: {
        margin: "0 2px",
    }
})

export const Month = styled(Moment)({
    width: "100%",

    [maxWidth(600)]: {
        margin: "0 2px",
    }
})