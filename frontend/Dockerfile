### Stage Build ###
FROM node:24-alpine AS BUILD

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build
### Stage Run ###
FROM nginx:alpine

COPY --from=BUILD /app/dist usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5175

CMD [ "nginx", "-g", "daemon off;" ]