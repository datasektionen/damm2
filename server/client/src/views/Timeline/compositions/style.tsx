import styled from '@emotion/styled'
import { maxWidth } from '../../../common/Theme'

export const StyledFilter = styled.div({
    margin: "0 auto",
    textAlign: "center",
    padding: "20px 40px 10px 0",
    userSelect: "none",


    "i": {
        marginLeft: "5px",
        cursor: "pointer",
    },

    "h5": {
        cursor: "pointer",
        width: "80px",
        margin: "0 auto",
    },

    [maxWidth(600)]: {
        padding: "20px"
    }
})

export const Checkboxes = styled.div({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "40px",
    paddingTop: "20px",
})