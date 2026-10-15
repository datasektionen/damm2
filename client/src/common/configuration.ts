export const Configuration = {
  apiBaseUrl: import.meta.env.VITE_API_ENDPOINT ?? 'http://localhost:8080',
  loginUrl:
    import.meta.env.VITE_LOGIN_FRONTEND_URL ?? 'https://login.datasektionen.se',
};
