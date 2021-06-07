import React from 'react';
import { StyledSelector } from './style';

interface Props {
    // values: { label: string; key: string; }[];
    values: {
        groupLabel: string;
        values: {
            label: string;
            key: string;
        }[]
    }[];
    value?: string;
    onChange?: (event: any) => void;
}

export const Selector: React.FC<Props> = props => {
    const { values } = props;

    return (
        <StyledSelector value={props.value} onChange={props.onChange}>
            {values.map((v, i) =>
                <optgroup label={v.groupLabel} key={"group-"+i}>
                    {v.values.map((v2, j) =>
                        <option key={v.groupLabel+"-"+i+v2.key+"-"+i} value={v2.key}>
                            {v2.label}
                        </option>
                    )}
                </optgroup>
            )}
        </StyledSelector>
    )
}
