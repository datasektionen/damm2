# 3.18 is needed for openssl1.1-compat
FROM node:20-alpine3.18 AS base

WORKDIR /app
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN apk add --no-cache openssl1.1-compat # needed for prisma to work

FROM base AS frontend

COPY client/package.json client/package-lock.json ./

RUN npm install --ignore-scripts

COPY client/ .

ARG REACT_APP_API_ENDPOINT=https://damm.datasektionen.se
ARG REACT_APP_S3_BUCKET=dsekt-damm-prod

RUN npm run build --ignore-scripts

FROM base AS backend

COPY package.json package-lock.json ./

RUN npm install --ignore-scripts

COPY prisma/ prisma/

RUN ./node_modules/.bin/prisma generate

COPY common/ common/
COPY functions/ functions/
COPY routes/ routes/
COPY app.ts fuzzyfile.json tsconfig.json ./

RUN npm run build

FROM base

COPY --from=backend /app/prisma /app/prisma
COPY --from=backend /app/node_modules /app/node_modules
COPY --from=backend /app/dist /app/dist
COPY --from=frontend /app/build/ /app/dist/client/build/

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/app.js"]
