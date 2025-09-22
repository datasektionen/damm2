# Damm
Historiesystem

# API documentation
Available [here](https://duckumentation.datasektionen.se/damm)

# Pls permissions
There are three hive permissions:
- `admin`
- `prylis`
- `post`

`admin` gives access to everything. `prylis` only gives access to managing patches and tags (including artefact tags 🙃). `post` can create events and edit their own events.

# Dependencies (Sektionens system)
Damm uses the following systems:

Login2 - login with KTH-account
Pls - to check admin priveleges of users
Dfunkt - to get information about funktionärer and when they were elected (timeline)
Zfinger - to fetch images of users (timeline)

# Dependencies
- npm
- PostgreSQL

## Migrate database
1. Make changes
2. Run `npx prisma migrate dev --name <name_of_migration>`
3. Commit and push

# Environment variables

When running locally you can mock login with [nyckeln under dörrmattan](https://github.com/datasektionen/nyckeln-under-dorrmattan) and use an own AWS account to get an s3 bucket, in which case you should look at [bucket configuration](bucket_configuration.md). There is also a bucket called `dsekt-damm-dev` that you may get access to from <a href="mailto:d-sys@datasektionen.se">d-sys</a>.

## Server
See [server/common/configuration.ts](server/common/configuration.ts)

| Name                      | Default                                   | Description                                               |
| ------------------------- | ----------------------------------------- | --------------------------------------------------------- |
| DATABASE_URL              | -                                         | Schema: `postgresql://USER:PASSWORD@HOST:PORT/DB_NAME`    |
| PORT                      | 8080                                      | Server port                                               |
| NODE_ENV                  | production                                |                                                           |
| AWS_REGION                | eu-north-1                                |                                                           |
| AWS_S3_BUCKET             | dsekt-damm-dev                            | NEVER!!!!!!!!!!! use `dsekt-damm-prod` locally            |
| AWS_ACCESS_KEY_ID         | -                                         |                                                           |
| AWS_SECRET_ACCESS_KEY     | -                                         |                                                           |
| LOGIN_API_URL             | https://login.datasektionen.se            | URL to login                                              |
| LOGIN_API_KEY             | -                                         | Login key                                                 |
| HIVE_API_URL              | https://hive.datasektionen.se/api/v1      | URL to hive api                                           |
| HIVE_API_KEY              |                                           | API key to check permissions in hive                      |

## Client
See [server/client/src/common/configuration.ts](server/client/src/common/configuration.ts)

| Name                      | Default                                                                               | Description                           |
| ------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------- |
| REACT_APP_API_ENDPOINT    | `http://localhost:8080` in development, `https://damm.datasektionen.se` in production | Used to fetch the API                 |
| HOST                      | `localhost` in development                                                            |                                       |
| NODE_OPTIONS              | --openssl-legacy-provider                                                             | Make webpack work on non-ancient node |

# How to run
## Development

1. Set up environment variables
1. Run `npm install` in root. Will install dependencies in both server and client.
1. Run `npx prisma migrate reset` in server/ (yes, npx, not npm)
1. Run `npm run dev:server` in project root
1. In another terminal, run `npm run dev:client` in project root

Server and client will hot reload when changes occurs

### Linting
Lint with `npm run lint` and fix (if possible) with `npm run lint:fix`. Make sure to lint before commiting (the CI will lint, but it won't fix any errors for you).
