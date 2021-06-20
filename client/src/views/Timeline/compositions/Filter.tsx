import React, { useState } from 'react';
import { Checkbox } from '../../../components/Checkbox/Checkbox';
import { StyledFilter, Checkboxes } from './style';

interface Props {
    filters: string[];
    templates: any;
    show: string[];
    setShow: (next: string[]) => void;
}

export const Filter: React.FC<Props> = ({ filters, templates, setShow, show}) => {
    
    const [open, setOpen] = useState(false);

    const onClick = (key: string) => {
        if (!show.includes(key)) setShow(show.concat(key))
        else setShow(show.filter(x => x !== key))
    }
    
    return (
        <StyledFilter>
            <h5 onClick={() => setOpen(!open)}>
                Filtrera
                <i className="fa fa-filter" />
            </h5>
            {open &&
                <Checkboxes>
                    {filters.map(x =>
                        <Checkbox
                            name={x + "-filter"}
                            label={templates[x].title}
                            checked={show.includes(x)}
                            setChecked={() => onClick(x)}
                        />
                    )}
                </Checkboxes>
            }
        </StyledFilter>

    )
}