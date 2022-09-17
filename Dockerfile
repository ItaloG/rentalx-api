FROM node:lts

WORKDIR /usr/app

COPY . .

RUN npm install -g npm@8.19.2 && npm install

EXPOSE 3333

CMD ["npm","run","dev"]