# Damm client

React app built with [Vite](https://vite.dev), [Mantine](https://mantine.dev) and [react-data-grid](https://github.com/adazzle/react-data-grid). See the [root README](../README.md) for how to run the whole project.

## Scripts

| Command            | Description                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `npm start`        | Dev server on [http://localhost:3000](http://localhost:3000). API calls are proxied to the server on port 8080. |
| `npm run build`    | Type-checks and builds to `build/`, then copies it to `../dist/client/build` for the server to serve. |
| `npm run preview`  | Serves the production build locally.                                                                 |
| `npm run lint`     | Lints `src/` with [oxlint](https://oxc.rs/docs/guide/usage/linter). `npm run lint:fix` fixes what it can. |
| `npm run format`   | Formats CSS and JSON with Prettier.                                                                  |

## Configuration

Environment variables are read from `.env.development` and `.env.production`, see [src/common/configuration.ts](src/common/configuration.ts).
