import React from 'react';
import { General } from '../General/General';

interface Props {
    id: number,
    index: number;
    content: string;
    title: string;
    date: string;
    protocol: string;
    onEditClick: () => void;
    createdBy: string;
}

export const SM: React.FC<Props> = ({ id, index, content, title, date, protocol, onEditClick, createdBy }) => {
    return (
        <General
            id={id}
            content={content}
            date={date}
            index={index}
            title={title}
            onEditClick={onEditClick}
            createdBy={createdBy}
        >
            <p>Protokollet finns tillgängligt <a href={protocol} target="_blank" rel="noopener noreferrer">här</a></p>
        </General>
    )
}