import React from 'react';
import { StyledButton, Loading } from './style';
import Spinner from '../../spinner.svg';
interface Props {
    color?: string;
    backgroundColor?: string;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
}

export const Button: React.FC<Props> = props => {
    return (
        <StyledButton {...props} onClick={props.onClick}>
            {props.isLoading &&
                <Loading src={Spinner} />
            }
            {props.label}
        </StyledButton>
    )
}