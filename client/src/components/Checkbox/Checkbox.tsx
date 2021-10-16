import React, { useState } from 'react';
import { StyledCheckbox, Label, StyledInput, Box, BoxCheck } from './style';

interface Props {
    name?: string;
    label: string;
    checked?: boolean;
    setChecked: (next: boolean) => void;
}

export const Checkbox: React.FC<Props> = ({ checked, name, label, setChecked }) => {
    
    return (
        <StyledCheckbox onClick={() => setChecked(!checked)}>
            <StyledInput
                name={name}
                type="checkbox"
                checked={checked}
            />
            <Box checked={checked} />
            <BoxCheck />
            <Label htmlFor={name}>
                {label}
            </Label>
        </StyledCheckbox>

    )
}