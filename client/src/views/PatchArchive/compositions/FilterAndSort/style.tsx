import styled from '@emotion/styled';
import FlipMove from 'react-flip-move';
import { maxWidth } from '../../../../common/Theme';

export const StyledFilterAndSort = styled.div({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "25px",
    boxShadow: "0 2px 5px rgba(0,0,0,.2)",
    backgroundColor: "#fff",

    [maxWidth(600)]: {
        padding: "25px 0px"
    }
})

export const Row = styled.div({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
})

export const ButtonRow = styled(Row)({
    "> button": {
        margin: "10px"
    }
})

export const Expander = styled.h3({
    cursor: "pointer",
    userSelect: "none",

    "> i": {
        margin: "5px"
    }
},
    (props: any) => ({
        "> i": {
            transform: props.expanded ? "rotate(-180deg" : "rotate(-180deg)"
        }
    })
)

export const Tags = styled.div({
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    "*": {
        transition: "none"
    }
},
    (props: any) => ({
        display: props.expanded ? "flex" : "none"
    })
)