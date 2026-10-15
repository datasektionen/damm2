import fs from "fs";

// Read from the .env-file
if (fs.existsSync(".env")) process.loadEnvFile();

const NODE_ENV = process.env.NODE_ENV ?? "production";

const configuration = {
  PORT: process.env.PORT ?? 8080,
  SESSION_SECRET: process.env.SESSION_SECRET,
  NODE_ENV,
  AWS_REGION: process.env.AWS_REGION ?? "eu-north-1",
  // Default to dev bucket, just in case
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET ?? "dsekt-damm-dev",
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  OIDC_PROVIDER: process.env.OIDC_PROVIDER ?? "https://sso.datasektionen.se/op",
  OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID ?? "damm",
  OIDC_CLIENT_SECRET: process.env.OIDC_CLIENT_SECRET,
  REDIRECT_URL:
    process.env.REDIRECT_URL ??
    (NODE_ENV === "development"
      ? // The Vite dev server proxies /oidc to us
        "http://localhost:3000/oidc/callback"
      : "https://damm.datasektionen.se/oidc/callback"),
  RFINGER_API_URL:
    process.env.RFINGER_API_URL ?? "https://rfinger.datasektionen.se",
  RFINGER_API_KEY: process.env.RFINGER_API_KEY,
};

if (
  configuration.NODE_ENV === "development" &&
  configuration.AWS_S3_BUCKET === "dsekt-damm"
) {
  console.log(
    "ERROR: NODE_ENV=development && AWS_S3_BUCKET=dsekt-damm-prod, vill du verkligen jobba med produktions-bucket:en? Stänger ned...",
  );
  process.exit(1);
}

export default configuration;
