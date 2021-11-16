import React from 'react';
import ReactMarkdown from 'react-markdown'
import { StyledGeneral } from './style';
import moment from 'moment';
import { CardHead } from '../CardHead';

interface Props {
    id: number,
    index: number;
    content: string;
    title: string;
    date: string;
    onEditClick: () => void;
    createdBy: string;
}

export const General: React.FC<Props> = ({ id, index, content, title, date, children, onEditClick, createdBy }) => {
    return (
        <StyledGeneral>
            <CardHead id={id} title={title} type="GENERAL" date={date} index={index} onEditClick={onEditClick} createdBy={createdBy} />
            {children}
            { content ? <ReactMarkdown linkTarget="_blank">{content}</ReactMarkdown> : null }
        </StyledGeneral>   
    )
}