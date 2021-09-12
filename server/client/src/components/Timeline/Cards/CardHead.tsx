import React, { useContext } from 'react';
import { StyledCardHead, Date, Day, Month, H2, Arrow, ArrowPoint } from './style';
import 'moment/locale/sv';
import { AdminContext } from '../../../App';

interface Props {
    id: number;
    title: string;
    index: number;
    date: string;
    type: string;
    onEditClick: (id: number) => void;
}

export const CardHead: React.FC<Props> = ({ id, title, type, index, date, onEditClick }) => {

    const { admin } = useContext(AdminContext);
    const isAdmin = admin.includes("prylis") || admin.includes("admin");
    console.log(isAdmin)

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
            {type !== "DFUNKT" && isAdmin &&
                <i className="fas fa-edit" onClick={() => onEditClick(id)} title="Redigera" />
            }
            <Arrow index={index} />
            <ArrowPoint index={index} />
        </StyledCardHead>
    )
}