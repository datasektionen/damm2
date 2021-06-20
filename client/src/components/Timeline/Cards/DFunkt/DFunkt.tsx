import moment from 'moment';
import React from 'react';
import { CardHead } from '../CardHead';
import { StyledDFunkt, Users, User } from './style';
import { StyledGeneral } from '../General/style';


interface Props {
    index: number;
    mandates: any;
    date: string;
}

export const DFunkt: React.FC<Props> = ({ date, index, mandates }) => {
    return (
        <StyledGeneral>
            <CardHead id={-1} date={date} type="DFUNKT" title="Nya funktionärer" index={index} onEditClick={() => {}}/>
            <Users>
                {mandates.map((x: any) => (
                    <User
                        title={x.user.first_name + " " + x.user.last_name + " tillträdde som " + x.role.title}
                        key={'mandate-pic-' + x.user.kthid + '-' + x.role.identifier + '-' + date}
                        user={x.user.kthid}   
                    />
                ))}
            </Users>
            {mandates.length > 1 ?
                (
                    <div>
                        <p>På denna dag fick {mandates.length} poster nya funktionärer.</p>
                        <ul>
                            {mandates.map((mandate: any) => (
                                <li key={'mandate-' + mandate.user.kthid + '-' + mandate.role.identifier + '-' + date}>
                                    { mandate.user.first_name} { mandate.user.last_name} tillträdde som { mandate.role.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
                :
                (
                    <p>På denna dag tillträdde { mandates[0].user.first_name} { mandates[0].user.last_name} som { mandates[0].role.title}</p>
                )
            }
        </StyledGeneral>
    )
}