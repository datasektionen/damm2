import styled from '@emotion/styled';
import Theme from '../../common/Theme';

export const StyledSearch = styled.div({
    // display: "relative",
    height: "50px",
},
    (props: any) => ({
        width: props.width ? `${props.width}px` : "300px"
    })
)

export const StyledInput = styled.input({
    height: "100%",
    width: "100%",
    padding: "10px 35px 10px 10px"
})

export const ClearButton = styled.div({
    cursor: "pointer",
    position: "relative",
    "> i": {
        position: "absolute",
        right: "calc(0% + 15px)",
        top: "calc(25px - 8px)",
        opacity: 0.6,
    }
})