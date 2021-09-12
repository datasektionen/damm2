import React from 'react';
import { StyledBiSwitch, Area, Indicator, Text } from './style';

interface Props {
    left: { label: string; key: string };
    right: { label: string; key: string };
    value: string;
    setValue: (value: string) => void;
}

export const BiSwitch: React.FC<Props> = ({ left, right, value, setValue }) => {

    const toggle = () => {
        if (value === left.key) setValue(right.key)
        else setValue(left.key)
    }

    return (
        <StyledBiSwitch>
            <Text highlighted={left.key === value}>
                {left.label}
            </Text>
            <Area onClick={toggle}>
                <Indicator left={value === left.key} />
            </Area>
            <Text highlighted={right.key === value}>
                {right.label}
            </Text>
        </StyledBiSwitch>
    )
}