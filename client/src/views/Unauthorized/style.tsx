import styled from '@emotion/styled';
import { maxWidth } from '../../common/Theme';

export const StyledNotFound = styled.div({
    textAlign: "center",
    padding: "100px 50px",

    "> h3": {
        marginBottom: "30px"
    },

    [maxWidth(600)]: {
        padding: "20px"
    }
})