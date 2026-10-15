FROM node:24-alpine AS base

WORKDIR /app
# RUN apk add --no-cache openssl1.1-compat # needed for prisma to work

FROM base AS frontend

COPY client/package.json client/package-lock.json ./

RUN npm install

COPY client/ .

ARG VITE_API_ENDPOINT=https://damm.datasektionen.se
ARG VITE_S3_BUCKET=dsekt-damm-prod

RUN npm run build --ignore-scripts

FROM base AS backend

COPY package.json package-lock.json ./

RUN npm install --ignore-scripts

COPY prisma/ prisma/

RUN npx prisma generate

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
