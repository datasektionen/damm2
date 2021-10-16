import React from 'react';
import { StyledField } from './style';

interface Props {
    value?: string;
    onChange?: (event: any) => void;
    placeholder?: string;
    name?: string;
    disabled?: boolean;
    type?: "text" | "date"
}

export const Field: React.FC<Props> = props => {
    return (
        <StyledField
            type={props.type ?? "text"}
            name={props.name}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            disabled={props.disabled}
        />
    )
}