import React from 'react';
import { StyledTag } from './style';

interface Props {
    name: string;
    color: string;
    backgroundColor: string;
    description: string;
}

export const Tag: React.FC<Props> = props => {

    return (
        <StyledTag
            title={props.description.length === 0 ?"Ingen beskrivning" : props.description}
            color={props.color}
            backgroundColor={props.backgroundColor}
        >
            {props.name}
        </StyledTag>
    )
}