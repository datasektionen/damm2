import React, { useEffect, useState } from 'react';
import Methone from 'methone';
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import { PatchArchive } from './views/PatchArchive/PatchArhive';
import './index.css';
import { ROUTES } from './common/routes';
import axios from 'axios';
import { url } from './common/api';

export const App: React.FC = props => {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // TODO: Ask backend if admin
    }
    
  }, [])

  useEffect(() => {
    if (localStorage.getItem("token")) setHasToken(true)
    else setHasToken(false)
  })

  const methoneLinks = [
  <Link to={ROUTES.HOME}>Hem</Link>,
    <Link to={ROUTES.PATCH_ARCHIVE}>Märkesarkiv</Link>,
  ]

  return (
    <div id="application" className="cerise">
      <BrowserRouter>
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
          <Route exact path={ROUTES.HOME}>
            <Redirect to={ROUTES.PATCH_ARCHIVE} />
          </Route>
          <Route exact path={ROUTES.PATCH_ARCHIVE}>
            <PatchArchive />
          </Route>
          <Route exact path={ROUTES.PATCH_ARCHIVE_ID}>
            <PatchArchive />
          </Route>

          <Route exact path={ROUTES.LOGIN} render={match => {
            window.location = `https://login.datasektionen.se/login?callback=${encodeURIComponent(window.location.origin)}/token/` as any;
            return <div></div>
          } } />
          <Route exact path={ROUTES.LOGOUT} render={({match}) => {
            localStorage.removeItem('token')
            window.location=ROUTES.HOME as any;
            return <div></div>
          }} />
          <Route exact path="/token/:token" render={({match, history}) => {
            localStorage.setItem('token', match.params.token);
            return <Redirect to={ROUTES.HOME} />
          }}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
};