import React, { useEffect, useState } from 'react';
import Methone from 'methone';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import { PatchArchive } from './views/PatchArchive/PatchArchive';
import { TagsManager } from './views/TagsManager/TagsManager';
import './index.css';
import { ROUTES } from './common/routes';
import { PatchCreator } from './views/PatchCreator/PatchCreator';
import { ScrollToTop } from './components/ScrollToTop/ScrollToTop';
import { NotFound } from './views/NotFound/NotFound';
import { Timeline } from './views/Timeline/Timeline';
import { EventHandler } from './views/EventHandler/EventHandler';
import useAuthorization from './hooks/useAuthorization';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { ArtefactArchive } from './views/ArtefactArchive/ArtefactArchive';
import { ArtefactCreator } from './views/ArtefactCreator/ArtefactCreator';

export const AdminContext = React.createContext<{ loading: boolean; admin: string[]; }>({ loading: true, admin: [] })

const defaultLinks = [
    <Link to={ROUTES.PATCH_ARCHIVE} key={"methonel-parchive"}>Märkesarkiv</Link>,
    <Link to={ROUTES.MUSEUM} key={"methonel-museum"}>Museum</Link>,
    <Link to={ROUTES.TIMELINE} key={"methonel-timeline"}>Tidslinje</Link>,
];

export const App: React.FC = props => {
    const [methoneLinks, setMethoneLinks] = useState<React.ReactNode[]>(defaultLinks);

    const { admin, loading, hasToken } = useAuthorization();

    useEffect(() => {
        if (admin.includes("admin")) {
            setMethoneLinks([...defaultLinks].concat(
                <Link to={ROUTES.PATCH_CREATOR} key={"methonel-pcreator"}>Skapa märke</Link>,
                <Link to={ROUTES.ARTEFACT_CREATOR} key={"methonel-pcreator"}>Skapa föremål</Link>,
                <Link to={ROUTES.TAGS_MANAGER} key={"methonel-tmanager"}>Hantera taggar</Link>,
                <Link to={ROUTES.EVENT_HANDLER} key={"methonel-ehandler"}>Hantera händelser</Link>,
            ))
        } else if (admin.includes("prylis")) {
            setMethoneLinks([...defaultLinks].concat(
                <Link to={ROUTES.PATCH_CREATOR} key={"methonel-pcreator"}>Skapa märke</Link>,
                <Link to={ROUTES.TAGS_MANAGER} key={"methonel-tmanager"}>Hantera taggar</Link>,
            ))
        }
    }, [admin, loading])

    return (
        <div id="application" className="cerise">
            <AdminContext.Provider value={{ loading, admin }}>
                <ScrollToTop />
                <Methone
                    config={{
                        system_name: 'damm',
                        color_scheme: 'cerise',
                        links: methoneLinks,
                        login_href: hasToken ? '/logout' : '/login',
                        login_text: hasToken ? 'Logga ut' : 'Logga in',
                    }}
                />
                <Switch>
                    <Route exact path={ROUTES.TIMELINE}>
                        <Timeline />
                    </Route>
                    <Route exact path={ROUTES.HOME}>
                        <Redirect to={ROUTES.PATCH_ARCHIVE} />
                    </Route>
                    <Route exact path={ROUTES.PATCH_ARCHIVE}>
                        <PatchArchive />
                    </Route>
                    <Route exact path={ROUTES.MUSEUM}>
                        <ArtefactArchive />
                    </Route>
                    <Route exact path={ROUTES.PATCH_CREATOR}>
                        <ProtectedRoute allowed="prylis">
                            <PatchCreator />
                        </ProtectedRoute>
                    </Route>
                    <Route exact path={ROUTES.ARTEFACT_CREATOR}>
                        <ProtectedRoute allowed="admin">
                            <ArtefactCreator />
                        </ProtectedRoute>
                    </Route>
                    <Route exact path={ROUTES.TAGS_MANAGER}>
                        <ProtectedRoute allowed="prylis">
                            <TagsManager />
                        </ProtectedRoute>
                    </Route>
                    <Route exact path={ROUTES.EVENT_HANDLER}>
                        <ProtectedRoute allowed="admin">
                            <EventHandler />
                        </ProtectedRoute>
                    </Route>

                    <Route exact path={ROUTES.LOGIN} render={match => {
                        window.location = `https://login.datasektionen.se/login?callback=${encodeURIComponent(window.location.origin)}/token/` as any;
                        return <div></div>
                    }} />
                    <Route exact path={ROUTES.LOGOUT} render={({ match }) => {
                        localStorage.removeItem('token')
                        window.location = ROUTES.HOME as any;
                        return <div></div>
                    }} />
                    <Route exact path="/token/:token" render={({ match, history }) => {
                        localStorage.setItem('token', match.params.token);
                        return <Redirect to={ROUTES.HOME} />
                    }} />
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </AdminContext.Provider>
        </div>
    );
};