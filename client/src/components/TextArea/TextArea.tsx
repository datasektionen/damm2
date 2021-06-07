import React from 'react';
import { StyledTextArea } from './style';

interface Props {
    value?: string;
    onChange?: (event: any) => void;
    placeholder?: string;
}

export const TextArea: React.FC<Props> = props => {
    return (
        <StyledTextArea
            placeholder={props.placeholder}
            
        />
    )
}