import React from 'react';
import { ListContent, ListHead, ListEntry, HeadItem, ListItem, EditButton, StyledEventTable, TrashButton } from './style';
import { IEvent } from '../../../../types/definitions';

interface Props {
    items: IEvent[];
    requestSort: (key: string) => void;
    sortConfig: { key: string; direction: string; };
    collapse: boolean;
    onEditClick: (event: IEvent) => void;
    onDelete: (id: number) => void;
    deleting: boolean;
}

export const EventTable: React.FC<Props> = ({ items, requestSort, sortConfig, collapse, onEditClick, onDelete, deleting }) => {

    const getAscDesc = (name: string) => sortConfig.key === name ? sortConfig.direction : "asc";

    return (
        <StyledEventTable>
            {!collapse &&
                <>
                    <ListHead>
                        <HeadItem direction={getAscDesc("id")}>
                            Id
                            <i className="fas fa-chevron-down" onClick={() => requestSort("id")} />
                        </HeadItem>
                        <HeadItem direction={getAscDesc("title")}>
                            Titel
                            <i className="fas fa-chevron-down" onClick={() => requestSort("title")} />
                        </HeadItem>
                        <HeadItem direction={getAscDesc("date")}>
                            Datum
                            <i className="fas fa-chevron-down" onClick={() => requestSort("date")} />
                        </HeadItem>
                        <HeadItem direction={getAscDesc("type")}>
                            Typ
                            <i className="fas fa-chevron-down" onClick={() => requestSort("type")} />
                        </HeadItem>
                        <HeadItem></HeadItem>
                    </ListHead>
                    <ListContent>
                        {items.map((e, i: number) =>
                            <ListEntry key={"event-"+i} index={i}>
                                <ListItem>{e.id}</ListItem>
                                <ListItem>{e.title}</ListItem>
                                <ListItem>{e.date}</ListItem>
                                <ListItem type={e.type}>{e.type}</ListItem>
                                <ListItem>
                                    <EditButton
                                        className="fas fa-edit"
                                        onClick={() => onEditClick(e)}
                                        title="Redigera"
                                        disabled={deleting}
                                    />
                                    <TrashButton
                                        className="fas fa-trash-alt"
                                        onClick={() => onDelete(e.id)}
                                        title="Radera"
                                        disabled={deleting}
                                    />
                                </ListItem>
                            </ListEntry>  
                        )}
                    </ListContent>
                </>
            }
        </StyledEventTable>
        
    )
}