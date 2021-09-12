import styled from '@emotion/styled';
import Theme, { maxWidth } from '../../common/Theme';

export const StyledPatch = styled.div({
    backgroundColor: "#f9f9f9f9",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    borderRadius: "2px",
    display: "flex",
    flexDirection: "column",
    height: "350px",
    margin: "10px",
    userSelect: "none",
    transition: "all 0.25s ease-in-out",
    position: "relative",

    ":hover": {
        transform: "scale(1.05)"
    },
},
    (props: any) => ({
        cursor: props.disabled ? "not-allowed" : "pointer",
    })
);

export const PatchImage = styled.div({
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
},
    (props: any) => ({
        backgroundImage: `url("${props.image}")`
    })
)

export const Hover = styled.span({
    overflow: "hidden",
    color: "white",
    fontWeight: "bold",
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
})

export const HoverTags = styled.div({
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    flexFlow: "wrap",
    padding: "10px 0 10px 0",
    fontWeight: "normal",
})

export const PatchInfo = styled.div({
    display: "flex",
})

export const PatchInfoItem = styled.div({
    fontWeight: 300,
    height: "40px",
    textAlign: "center",
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    [maxWidth(500)]: {
        height: "25px",
        fontSize: "0.9em"
    }
})

export const PatchItemDate = styled(PatchInfoItem)({
    background: Theme.palette.cerise,
    color: "#fff",
    width: "100%",
    "> i:first-of-type": {
        marginRight: "10px"
    }
})

export const PatchName = styled.div({
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    wordBreak: "break-word",
    margin: "10px",

    "h2": {
        fontSize: "1.1em",
        fontWeight: 700,
        textAlign: "center",
        margin: 0,
    },

    [maxWidth(500)]: {
        margin: "5px",
        "h2": {
            fontSize: "0.9em",
        },
    }
})