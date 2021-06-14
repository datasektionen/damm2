import React from 'react';
import { Header } from 'methone';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../common/routes';
import { StyledNotFound } from './style';

export const NotFound: React.FC = props => {
    return (
        <>
            <Header title="404 Not Found" />
            <StyledNotFound>
            <h3>Det här gick ju inte så bra...</h3>
            <h4>Kanske stavade du fel i adressen, eller så har sidan flyttat. Om du tror att detta är fel,
                kontakta <a href="https://dfunkt.datasektionen.se/position/id/27" target="_blank" rel="noopener noreferrer">sektionshistorikern</a>
                , <a href="https://ior.slack.com/" target="_blank" rel="noopener noreferrer">IOR</a> eller <a href="https://github.com/datasektionen/damm/issues/new" target="_blank" rel="noopener noreferrer">skapa en issue på Github</a>.</h4>
            <Link to={ROUTES.HOME}>Hem</Link>
            </StyledNotFound>
        </>
    )
}