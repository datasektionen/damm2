import React from 'react';
import { Header } from 'methone';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../common/routes';
import { StyledNotFound } from './style';
import Helmet from 'react-helmet';
import { title } from '../../common/strings';

export const Unauthorized: React.FC = props => {
    return (
        <>
            <Header title="401 Unauthorized" />
            <Helmet>
                <title>{title("401")}</title>
            </Helmet>
            <StyledNotFound>
            <h3>Det här gick ju inte så bra...</h3>
            <h4>Du har inte tillgång till sidan. Om du tror att detta är fel,
                kontakta <a href="https://dfunkt.datasektionen.se/position/id/27" target="_blank" rel="noopener noreferrer">sektionshistorikern</a>
                , <a href="https://ior.slack.com/" target="_blank" rel="noopener noreferrer">IOR</a> eller <a href="https://github.com/datasektionen/damm/issues/new" target="_blank" rel="noopener noreferrer">skapa en issue på Github</a>.</h4>
            <Link to={ROUTES.HOME}>Hem</Link>
            </StyledNotFound>
        </>
    )
}