import React from 'react';
import { StyledField } from './style';

interface Props {
    value?: string;
    onChange?: (event: any) => void;
    placeholder?: string;
}

export const Field: React.FC<Props> = props => {
    return (
        <StyledField
            placeholder={props.placeholder}
            
        />
    )
}