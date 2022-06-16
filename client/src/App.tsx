import React, { useEffect, useState } from 'react';
import Methone from 'methone';
import { Link, Route, Routes, useParams, Navigate } from 'react-router-dom';
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
import { Landing } from './views/Landing/Landing';

export const AdminContext = React.createContext<{ loading: boolean; admin: string[]; user: string; }>({ loading: true, admin: [], user: "" })

const defaultLinks = [
    <Link to={ROUTES.HOME} key={"methonel-home"}>Hem</Link>,
    <Link to={ROUTES.PATCH_ARCHIVE} key={"methonel-parchive"}>Märkesarkiv</Link>,
    <Link to={ROUTES.MUSEUM} key={"methonel-museum"}>Museum</Link>,
    <Link to={ROUTES.TIMELINE} key={"methonel-timeline"}>Tidslinje</Link>,
];

export const App: React.FC = props => {
    const [methoneLinks, setMethoneLinks] = useState<React.ReactNode[]>(defaultLinks);

    const { admin, loading, hasToken, user } = useAuthorization();

    useEffect(() => {
        if (admin.includes("admin")) {
            setMethoneLinks([...defaultLinks].concat(
                <Link to={ROUTES.PATCH_CREATOR} key={"methonel-pcreator"}>Skapa märke</Link>,
                <Link to={ROUTES.ARTEFACT_CREATOR} key={"methonel-acreator"}>Skapa föremål</Link>,
                <Link to={ROUTES.TAGS_MANAGER} key={"methonel-tmanager"}>Hantera taggar</Link>,
                <Link to={ROUTES.EVENT_HANDLER} key={"methonel-ehandler"}>Hantera händelser</Link>,
                <Link to={ROUTES.STORAGE} key={"methonel-pstorage"}>Hantera märkesarkiv</Link>,
            ))
        } else if (admin.includes("post")) {
            setMethoneLinks([...defaultLinks].concat(
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
            <AdminContext.Provider value={{ loading, admin, user }}>
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
                <Routes>
                    <Route
                        path={ROUTES.TIMELINE}
                        element={<Timeline />}
                    />
                    <Route
                        path={ROUTES.HOME}
                        element={<Landing />}
                    />
                    <Route path={ROUTES.PATCH_ARCHIVE} element={<PatchArchive />} />
                    <Route path={ROUTES.MUSEUM} element={<ArtefactArchive />} />
                    <Route
                        path={ROUTES.PATCH_CREATOR}
                        element={
                            <ProtectedRoute allowed={["prylis"]}>
                                <PatchCreator />
                            </ProtectedRoute>
                        }
                    />
                    <Route path={ROUTES.ARTEFACT_CREATOR}
                        element={
                            <ProtectedRoute allowed={["admin"]}>
                                <ArtefactCreator />
                            </ProtectedRoute>
                        }
                    />
                    <Route path={ROUTES.TAGS_MANAGER}
                        element={
                            <ProtectedRoute allowed={["prylis"]}>
                                <TagsManager />
                            </ProtectedRoute>
                        }
                    />
                    <Route path={ROUTES.EVENT_HANDLER}
                        element={
                            <ProtectedRoute allowed={["admin", "post"]}>
                                <EventHandler />
                            </ProtectedRoute>
                        }
                    />
                    <Route path={ROUTES.LOGIN} element={<Login />} />
                    <Route path={ROUTES.LOGOUT} element={<Logout />} />
                    <Route path="/token/:token" element={<Token />} />
                    <Route
                        element={
                            <NotFound />
                        }
                    />
                </Routes>
            </AdminContext.Provider>
        </div>
    );
};

const Token = () => {
    const { token } = useParams();
    // const navigate = useNavigate();
    useEffect(() => {
        localStorage.setItem('token', token as string);
    }, [])

    return (
        <Navigate to={ROUTES.HOME} />
    )
}

const Login = () => {
    useEffect(() => {
        window.location = `https://login.datasektionen.se/login?callback=${encodeURIComponent(window.location.origin)}/token/` as any;
    })

    return (
        <></>
    )
}

const Logout = () => {
    useEffect(() => {
        localStorage.removeItem('token');
    })

    return (
        <Navigate to={ROUTES.HOME} />
    )
}