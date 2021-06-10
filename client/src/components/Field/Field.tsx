import React from 'react';
import { StyledField } from './style';

interface Props {
    value?: string;
    onChange?: (event: any) => void;
    placeholder?: string;
    name?: string;
    disabled?: boolean;
}

export const Field: React.FC<Props> = props => {
    return (
        <StyledField
            name={props.name}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            disabled={props.disabled}
        />
    )
}