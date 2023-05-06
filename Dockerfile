FROM node:18.16.0-alpine3.17
ARG APP_MAINTAINER="Beautix team"
ARG APP_DESCRIPTION="Tunnel sentry with express"
ENV APP_PORT=3001
ENV NODE_ENV="production"

LABEL "maintainer" = $APP_MAINTAINER
LABEL "description" = $APP_DESCRIPTION
LABEL "enviroment" = $NODE_ENV

WORKDIR /app 

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --silent && yarn cache clean

COPY . .

EXPOSE $APP_PORT

CMD ["yarn", "start"]

# example generate image
# docker build -t tunnel-sentry .

# example run container
# docker run -p 3001:3001 -e NODE_ENV=production -e DOCKER_ENV=true -e SENTRY_HOST=o4504968963555328.ingest.sentry.io -e PROJECT_IDS=4504969359917056 -e CORS_ORIGIN=http://localhost:3005 -e PORT=3001 tunnel-sentry
