// Loads env variables
import configuration from "./common/configuration";
import { SsoUser } from "./common/types";
import apiRouter from "./routes/api";
import cors from "cors";
import express from "express";
import session from "express-session";
import fs from "fs";
import morgan from "morgan";
import * as oidc from "openid-client";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: configuration.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
  }),
);

// Log requests to console
// Don't log when NODE_ENV == testing
if (configuration.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else if (configuration.NODE_ENV === "production") {
  app.use(morgan("common"));
}

let oidcConfig: oidc.Configuration;

async function initOIDC() {
  const provider = new URL(configuration.OIDC_PROVIDER);
  oidcConfig = await oidc.discovery(
    provider,
    configuration.OIDC_CLIENT_ID,
    undefined,
    // SSO only supports client_secret_basic, v6 defaults to client_secret_post
    oidc.ClientSecretBasic(configuration.OIDC_CLIENT_SECRET),
    // Local mock SSO (nyckeln) runs over plain http. "Deprecated" is only a warning flag, there is no replacement
    configuration.NODE_ENV === "development" && provider.protocol === "http:"
      ? { execute: [oidc.allowInsecureRequests] }
      : undefined,
  );

  console.log("OIDC client initialized");
}

initOIDC();

app.get("/login", (req, res) => {
  const state = oidc.randomState();
  req.session.oidcState = state;

  const authUrl = oidc.buildAuthorizationUrl(oidcConfig, {
    redirect_uri: configuration.REDIRECT_URL,
    scope: "openid profile email permissions",
    state,
  });

  res.redirect(authUrl.href);
});

// Callback
app.get("/oidc/callback", async (req, res, next) => {
  try {
    // Build from REDIRECT_URL rather than req, since we run behind a proxy
    const currentUrl = new URL(configuration.REDIRECT_URL);
    currentUrl.search = new URL(req.originalUrl, currentUrl).search;

    const tokenSet = await oidc.authorizationCodeGrant(oidcConfig, currentUrl, {
      expectedState: req.session.oidcState,
    });
    delete req.session.oidcState;

    const userinfo = (await oidc.fetchUserInfo(
      oidcConfig,
      tokenSet.access_token,
      tokenSet.claims()?.sub ?? oidc.skipSubjectCheck,
    )) as unknown as SsoUser;

    const permissions = [];
    for (const perm of userinfo.permissions) {
      permissions.push(perm.id);
    }

    req.session.user = {
      emails: userinfo.email,
      first_name: userinfo.given_name,
      last_name: userinfo.family_name,
      ugkthid: "ug" + userinfo.sub,
      user: userinfo.sub,
      admin: permissions,
    };
    req.session.tokens = tokenSet;

    res.cookie("token", tokenSet);
    res.cookie("admin", permissions);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.use("/api", apiRouter);

const fuzzyfile = fs.readFileSync(path.join(__dirname, "fuzzyfile.json"));
app.get("/fuzzyfile", (req, res) => res.send(fuzzyfile));

// Serve React app
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("/{*splat}", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "build", "index.html")),
);

const PORT = configuration.PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

export default app;
