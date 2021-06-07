import React from 'react';
import { StyledButton } from './style';

interface Props {
    color?: string;
    backgroundColor?: string;
    label: string;
    onClick: () => void;
}

export const Button: React.FC<Props> = props => {
    return (
        <StyledButton {...props} onClick={props.onClick}>
            {props.label}
        </StyledButton>
    )
}