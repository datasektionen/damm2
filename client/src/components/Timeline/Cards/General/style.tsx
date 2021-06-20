import styled from '@emotion/styled';
import { maxWidth } from '../../../../common/Theme';

export const StyledGeneral = styled.div({
    background: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    padding: "20px 20px 10px",
    borderRadius: "2px",
    margin: "10px 40px",
    

    "> p": {
        wordBreak: "break-word",
        margin: "15px 0 0",
    },

    [maxWidth(600)]: {
        margin: "10px 0 10px 20px",
        padding: "15px 15px 10px",
    }
})
