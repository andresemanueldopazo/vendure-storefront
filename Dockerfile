FROM node:16

RUN apt-get -q update && apt-get -qy install netcat

WORKDIR /app

COPY package.json turbo.json yarn.lock ./
COPY site/ ./site/
COPY packages/ ./packages/
COPY wait-for.sh ./

RUN yarn