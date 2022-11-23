FROM node:16.15.0-alpine

WORKDIR /Anis Tohme/Cars/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8802
CMD [ "node", "app.js" ]

