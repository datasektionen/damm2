import React from 'react';
import { StyledSelector } from './style';

interface Props {
    values: {
        groupLabel: string;
        values: {
            label: string;
            key: string;
            color?: string;
        }[]
    }[];
    name?: string;
    value?: string;
    onChange?: (event: any) => void;
}

export const Selector: React.FC<Props> = props => {
    const { values } = props;

    return (
        <StyledSelector value={props.value} onChange={props.onChange} name={props.name}>
            {values.map((v, i) =>
                <optgroup label={v.groupLabel} key={"group-"+i}>
                    {v.values.map((v2, j) =>
                        <option key={v.groupLabel+"-"+i+v2.key+"-"+i} value={v2.key} style={{color: v2.color ?? "initial"}}>
                            {v2.label}
                        </option>
                    )}
                </optgroup>
            )}
        </StyledSelector>
    )
}
