FROM node:16.15.1


WORKDIR /usr/app

COPY package.json ./

RUN npm install -g npm@8.13.1

COPY . .

EXPOSE 3333

CMD ["npm","run","dev"]