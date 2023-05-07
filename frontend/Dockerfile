# Stage 1: build
FROM node:18 AS development

WORKDIR /rr56/frontend/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@13.2.5

COPY . .

RUN npm run build

EXPOSE 4200
