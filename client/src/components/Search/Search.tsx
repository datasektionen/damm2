import React from 'react';
import { StyledSearch, StyledInput, ClearButton } from './style';

interface Props {
    value?: string;
    onChange?: (event: any) => void;
    onClear?: () => void;
    placeholder?: string;
    width?: number;
}

export const Search: React.FC<Props> = props => {
    return (
        <StyledSearch width={props.width}>
            <ClearButton onClick={props.onClear}>
                <i className="fas fa-times"></i>
            </ClearButton>
            <StyledInput
                type="text"
                placeholder={props.placeholder ?? "Sök"}
                autoComplete="off"
                value={props.value}
                onChange={props.onChange}
            />
        </StyledSearch>
    )
}