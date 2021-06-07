import dotenv from 'dotenv';
// Read from the .env-file
dotenv.config();

const configuration = {
    PORT: process.env.PORT ?? 8080,
    NODE_ENV: process.env.NODE_ENV ?? "production",
    AWS_REGION: process.env.AWS_REGION ?? "eu-north-1",
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET ?? "dsekt-damm",
    LOGIN_API_URL: process.env.LOGIN_API_URL ?? "https://login.datasektionen.se",
    LOGIN_API_KEY: process.env.LOGIN_API_KEY,
    PLS_API_URL: process.env.PLS_API_URL ?? "https://pls.datasektionen.se/api",
};

export default configuration;