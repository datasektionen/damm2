import React, { useContext } from 'react';
import ReactMarkdown from 'react-markdown'
import { StyledAnniversary, Head, HeadArrow, Node } from './style';
import moment from 'moment';
import 'moment/locale/sv';
import Moment from 'react-moment';
import { AdminContext } from '../../../../App';

interface Props {
    id: number;
    index: number;
    title: string;
    date: string;
    content: string;
    onEditClick: (id: number) => void;
}

export const Anniversary: React.FC<Props> = ({ id, index, title, date, content, onEditClick }) => {

    const { admin } = useContext(AdminContext);
    const isAdmin = admin.includes("prylis") || admin.includes("admin");

    return (
        <StyledAnniversary key={"card-" + moment(date).year() + "-" + index}>
            <Node index={index} />
            <HeadArrow index={index} />
            <Head index={index}>
                <h2>{title}</h2>
                {isAdmin &&
                    <i className="fas fa-edit" onClick={() => onEditClick(id)} title="Redigera" />
                }
            </Head>
            <Moment format="D MMMM YYYY">
                {date}
            </Moment>
            <i className="fa fa-star" />
            { content ? <ReactMarkdown>{content}</ReactMarkdown> : null }
        </StyledAnniversary>   
    )
}
