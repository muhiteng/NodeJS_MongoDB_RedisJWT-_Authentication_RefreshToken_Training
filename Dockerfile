FROM node:14 as base


FROM base as development

WORKDIR /app 
COPY package.json . 
ARG NODE_ENV
RUN  npm install
COPY . .
EXPOSE 4000
CMD [ "npm","run","start-dev" ]   # this command we override it in docker-compose.dev.yml, docker-compose.prod.yml

FROM base as production

WORKDIR /app 
COPY package.json . 
ARG NODE_ENV
RUN  npm install --only=production
COPY . .
EXPOSE 4000
CMD [ "npm","start" ]   # this command we override it in docker-compose.dev.yml, docker-compose.prod.yml
