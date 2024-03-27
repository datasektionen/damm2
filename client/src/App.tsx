import React, { FC, useEffect, useMemo, useState } from 'react';
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
import { Landing } from './views/Landing/Landing';
import { Admin } from './views/Admin/Admin';
import { PatchList } from './views/PatchList/PatchList';
import axios from 'axios';
import { Configuration } from './common/configuration';
import { BoxHandler } from './views/BoxHandler/BoxHandler';
import { BagHandler } from './views/BagHandler/BagHandler';
import { ExportPatches } from './views/ExportPatches/ExportPatches';
import { MantineProvider } from '@mantine/core';
import PersonManager from './views/PersonManager/PersonManager';
import { DarkModeContextProvider } from './hooks/useDarkMode';
import { AdminContext } from './hooks/useAppContext';

axios.defaults.baseURL = Configuration.apiBaseUrl;
axios.interceptors.request.use((config) => {
  if (new URL(config.url ?? "").origin != new URL(Configuration.apiBaseUrl).origin) return config;
  if (!config.headers.Authorization) {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

type Links = {
  home: JSX.Element;
  archive: JSX.Element;
  timeline: JSX.Element;
  admin?: JSX.Element;
};

const defaultLinks: Links = {
  home: (
    <Link to={ROUTES.HOME} key={'methonel-home'}>
      Hem
    </Link>
  ),
  archive: (
    <Link to={ROUTES.PATCH_ARCHIVE} key={'methonel-parchive'}>
      Märkesarkiv
    </Link>
  ),
  timeline: (
    <Link to={ROUTES.TIMELINE} key={'methonel-timeline'}>
      Tidslinje
    </Link>
  ),
};

type AppInnerProps = {
  methoneLinks: Links;
  hasToken: boolean;
};

const AppInner = (props: AppInnerProps) => {
  const { methoneLinks, hasToken } = props;

  return (
    <MantineProvider
      theme={{
        fontFamily: "'Lato', sans-serif",
        primaryColor: 'pink',
        fontFamilyMonospace: "'Lato', sans-serif",
      }}
    >
      <ScrollToTop />
      <Methone
        config={{
          system_name: 'damm',
          color_scheme: 'cerise',
          links: Object.values(methoneLinks),
          login_href: hasToken ? '/logout' : '/login',
          login_text: hasToken ? 'Logga ut' : 'Logga in',
        }}
      />
      <Routes>
        <Route path={ROUTES.TIMELINE} element={<Timeline />} />
        <Route path={ROUTES.HOME} element={<Landing />} />
        <Route path={ROUTES.PATCH_ARCHIVE} element={<PatchArchive />} />
        {/* <Route path={ROUTES.MUSEUM} element={<ArtefactArchive />} /> */}
        <Route path={ROUTES.ADMIN} element={<Admin />}>
          <Route
            path={ROUTES.ADMIN}
            element={
              <ProtectedRoute allowed={['prylis']}>
                <p>
                  Välkommen till administratörsvyn. Välj flik till vänster och
                  börja administrera.
                </p>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PATCH_CREATOR}
            element={
              <ProtectedRoute allowed={['prylis']}>
                <PatchCreator />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TAGS_MANAGER}
            element={
              <ProtectedRoute allowed={['prylis']}>
                <TagsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.EVENT_HANDLER}
            element={
              <ProtectedRoute allowed={['admin', 'post']}>
                <EventHandler />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MANAGE_BOXES}
            element={
              <ProtectedRoute allowed={['prylis']}>
                <BoxHandler />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MANAGE_BAGS}
            element={
              <ProtectedRoute allowed={['prylis']}>
                <BagHandler />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PATCH_LIST}
            element={
              <ProtectedRoute allowed={['prylis']}>
                <PatchList />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.EXPORT_PATCHES}
            element={
              <ProtectedRoute allowed={['prylis']}>
                <ExportPatches />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PERSON_MANAGER}
            element={
              <ProtectedRoute allowed={['prylis']}>
                <PersonManager />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={ROUTES.ADMIN} />} />
        </Route>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.LOGOUT} element={<Logout />} />
        <Route path="/token/:token" element={<Token />} />
        <Route element={<NotFound />} />
      </Routes>
    </MantineProvider>
  );
};

export const App: React.FC = (props) => {
  const [methoneLinks, setMethoneLinks] = useState(defaultLinks);

  const { admin, loading, hasToken, user } = useAuthorization();

  useEffect(() => {
    if (
      admin.includes('admin') ||
      admin.includes('post') ||
      admin.includes('prylis')
    ) {
      setMethoneLinks({
        ...defaultLinks,
        admin: <Link to={ROUTES.ADMIN}>Administrera</Link>,
      });
    }
  }, [admin, loading]);

  return (
    <div id="application" className="cerise">
      <DarkModeContextProvider>
        <AdminContext.Provider value={{ loading, admin, user }}>
          <AppInner methoneLinks={methoneLinks} hasToken={hasToken} />
        </AdminContext.Provider>
      </DarkModeContextProvider>
    </div>
  );
};

const Token = () => {
  const { token } = useParams();
  // const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem('token', token as string);
  }, []);

  return <Navigate to={ROUTES.HOME} />;
};

const Login = () => {
  useEffect(() => {
    window.location = `https://login.datasektionen.se/login?callback=${encodeURIComponent(
      window.location.origin
    )}/token/` as any;
  });

  return <></>;
};

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem('token');
  });

  return <Navigate to={ROUTES.HOME} />;
};
