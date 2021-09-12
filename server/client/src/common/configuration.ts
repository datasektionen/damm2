export const Configuration = {
    apiBaseUrl: process.env.REACT_APP_API_ENDPOINT ?? "http://localhost:8080",
    s3Bucket: process.env.REACT_APP_S3_BUCKET ?? "dsekt-damm-dev"
}