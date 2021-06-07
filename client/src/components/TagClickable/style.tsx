import styled from '@emotion/styled';
import Theme from '../../common/Theme';

export const StyledTagClickable = styled.div({
    borderRadius: "20px",
    padding: "10px",
    whiteSpace: "nowrap",
    userSelect: "none",
    margin: "5px",
    cursor: "pointer",
    width: "min-content",

    "> *": {
        margin: "0px 5px"
    },

    "> i": {
        opacity: 0.6
    }
},
    (props: any) => ({
        backgroundColor: props.clicked ? props.tag.backgroundColor : Theme.palette.taggrey,
        color: props.clicked ? props.tag.color : Theme.palette.blackgrey,

        ":hover": {
            backgroundColor: props.clicked ? props.tag.backgroundColor : Theme.palette.taggreyhover,
            transform: "scale(1.03)"
        },
    })
);