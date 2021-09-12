import styled from '@emotion/styled';
import Theme, { maxWidth } from '../../../../common/Theme';

export const StyledAnniversary = styled.div({
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgb(0, 0, 0, 0.2)",
    padding: "20px 20px 10px",
    borderRadius: "2px",
    margin: "10px 40px",
    position: "relative",
    textAlign: "center",

    "> time": {
        fontSize: "1.25em",
        textAlign: "center",
        margin: "0 auto",
        float: "none",
        padding: "10px 0",
        display: "block",
        color: "#555",
    },

    "> i[class='fa fa-star']": {
        fontSize: "5em",
        display: "block",
        padding: "20px",
        color: Theme.palette.yellow,
    },

    "> p": {
        wordBreak: "break-word"
    },

    [maxWidth(600)]: {
        margin: "10px 0 10px 20px",
        padding: "15px 15px 10px",
    },
})

export const Head = styled.div({
    wordBreak: "break-all",
    background: Theme.palette.yellow,
    padding: "20px 20px",
    minHeight: "62px",
    borderBottom: "1px solid #eee",
    margin: "-20px -20px 10px",
    position: "relative",

    "> h2": {
        margin: 0,
        padding: 0,
        fontSize: "1.2em",
    },

    "> i[class='fas fa-edit']": {
        float: "right",
        position: "absolute",
        top: "calc(50% - 8px)",
        cursor: "pointer",
    },

    "> i[class='fas fa-edit']:hover": {
        transform: "scale(1.2)"
    },

    [maxWidth(600)]: {
        minHeight: "40px",
        margin: "-15px -15px -5px",
    }
},
    (props: any) => ({
        "> i[class='fas fa-edit']": {
            right: props.index % 2 === 0 ? "auto" : "-25px",
            left: props.index % 2 === 0 ? "-25px" : "auto",
        },

        [maxWidth(900)]: {
            "> i[class='fas fa-edit']": {
                right: "-25px",
                left: "auto"
            },
        },
    })
)

export const HeadArrow = styled.div({
    position: "absolute",
    width: 0,
    height: 0,
    top: 0,
    borderTop: "30px solid transparent",
    borderBottom: "30px solid transparent",
},
    (props: any) => ({

        right: props.index % 2 === 0 ? "-30px" : "auto",
        borderLeft: props.index % 2 === 0 ? `30px solid ${Theme.palette.yellow}` : "none",
        left: props.index % 2 === 0 ? "auto" : "-30px",
        borderRight: props.index % 2 === 0 ? "none" : `30px solid ${Theme.palette.yellow}`,

        [maxWidth(900)]: {
            left: "-30px",
            right: "auto",
            borderRight: `30px solid ${Theme.palette.yellow}`,
            borderLeft: "none"
        },

        [maxWidth(600)]: {
            display: "none"
        }
    })
)

export const Node = styled.div({
    position: "absolute",
    width: "4px",
    height: "4px",
    backgroundColor: "#aaa",
    borderRadius: "5px",
    boxShadow: "0 0 2px 8px #eee",
    zIndex: 2,
    top: "28px",
},
    (props: any) => ({
        right: props.index % 2 === 0 ? "-42px" : "auto",
        left: props.index % 2 === 0 ? "auto" : "-42px",

        [maxWidth(900)]: {
            left: "-42px",
            right: "auto",
        },

        [maxWidth(600)]: {
            left: "-21px",
        }

        // if (props.index % 2 === 0) {
        //     style.right = "-42px"
        //     style.left = "auto"
        // } else {
        //     style.left = "-42px"
        // }

    })
)