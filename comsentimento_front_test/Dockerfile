FROM node:16 as angular
ENV NODE_ENV=production
WORKDIR /app
COPY package.json /app
RUN npm install --silent
COPY . ./app

RUN ng serve

FROM nginx:alpine
VOLUME /var/cache/nginx
COPY --from=angular app/dist/technical_test_front /usr/share/nginx/html
