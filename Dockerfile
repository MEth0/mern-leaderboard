FROM node:alpine

WORKDIR /usr/src/app

COPY api/package*.json ./api/
COPY client/package*.json ./client/

RUN npm install --prefix ./api
RUN npm install --prefix ./client

COPY . .

RUN npm run build --prefix ./client


EXPOSE 8080
CMD [ "node", "api/app.js" ]
