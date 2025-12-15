import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

import apiRouter from './routes/api';
// Loads env variables
import configuration from './common/configuration';
import { DammUser, SsoUser } from 'common/types';

const session = require('express-session');

const app = express();
app.use(express.json());
// app.use(express.cookieParser());
app.use(cors());

app.use(
    session({
        secret: configuration.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// Log requests to console
// Don't log when NODE_ENV == testing
if (configuration.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else if (configuration.NODE_ENV === "production") {
    app.use(morgan("common"));
}

let client: any;

async function initOIDC() {
    const { Issuer } = await import('openid-client');
    const issuer = await Issuer.discover(configuration.OIDC_PROVIDER!);

    client = new issuer.Client({
        client_id: configuration.OIDC_CLIENT_ID,
        client_secret: configuration.OIDC_CLIENT_SECRET,
        redirect_uris: [configuration.REDIRECT_URL],
        // response_types: ['code'],
    });

    console.log('OIDC client initialized');
}

initOIDC();

app.get('/login', (req, res) => {
    const authUrl = client.authorizationUrl({
        scope: 'openid profile email permissions',
    });

    res.redirect(authUrl);
});

// Callback
app.get('/oidc/callback', async (req, res, next) => {
    try {
        const params = client.callbackParams(req);
        const tokenSet = await client.callback(
            configuration.REDIRECT_URL,
            params
        );

        const userinfo: SsoUser = await client.userinfo(tokenSet.access_token);

        const permissions = [];
        for (const perm of userinfo.permissions) {
            permissions.push(perm.id)
        }

        req.session.user = {
            emails: userinfo.email,
            first_name: userinfo.given_name,
            last_name: userinfo.family_name,
            ugkthid: 'ug' + userinfo.sub,
            user: userinfo.sub,
            admin: permissions,
        }
        req.session.tokens = tokenSet;

        res.cookie('token', tokenSet)
        res.cookie('admin', permissions)
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.use("/api", apiRouter);

const fuzzyfile = fs.readFileSync(path.join(__dirname, "fuzzyfile.json"));
app.get("/fuzzyfile", (req, res) => res.send(fuzzyfile));

// Serve React app
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "client", "build", "index.html")));

const PORT = configuration.PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

export default app;
