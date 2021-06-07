import styled from '@emotion/styled';
import Theme from '../../common/Theme';

export const StyledButton = styled.button({

},
    (props: any) => ({
        backgroundColor: props.color ?? Theme.palette.yellow,
        color: props.color ?? Theme.palette.blackgrey,
        
    })
)