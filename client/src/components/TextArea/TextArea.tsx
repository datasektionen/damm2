import React from 'react';
import { StyledTextArea } from './style';

interface Props {
    value?: string;
    onChange?: (event: any) => void;
    placeholder?: string;
    name?: string;
    resize?: "none" | "both" | "horizontal" | "vertical",
    width?: string;
    disabled?: boolean;
}

export const TextArea: React.FC<Props> = props => {
    return (
        <StyledTextArea
            name={props.name}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            resize={props.resize}
            width={props.width}
            disabled={props.disabled}
        />
    )
}