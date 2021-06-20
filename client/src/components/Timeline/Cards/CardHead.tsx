import React from 'react';
import ReactMarkdown from 'react-markdown'
import { StyledCardHead, Date, Day, Month, H2, Arrow, ArrowPoint } from './style';
import 'moment/locale/sv';

interface Props {
    id: number;
    title: string;
    index: number;
    date: string;
    type: string;
    onEditClick: (id: number) => void;
}

export const CardHead: React.FC<Props> = ({ id, title, type, index, date, onEditClick }) => {
    return (
        <StyledCardHead index={index}>
            <Date>
                <Day format="DD">
                    {date}
                </Day>
                <Month format="MMM">
                    {date}
                </Month>
            </Date>
            <H2>{title}</H2>
            {type !== "DFUNKT" &&
                <i className="fas fa-edit" onClick={() => onEditClick(id)} title="Redigera" />
            }
            <Arrow index={index} />
            <ArrowPoint index={index} />
        </StyledCardHead>
    )
}