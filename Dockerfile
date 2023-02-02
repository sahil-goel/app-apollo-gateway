FROM node:18-bullseye

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY gateway.js .
COPY package.json .
COPY servicelist.js .
COPY serviceList-default.yaml .
COPY serviceList-dev.yaml .
COPY serviceList-test.yaml .
COPY serviceList-pre.yaml .
COPY serviceList-prod.yaml .
COPY serviceList-dr.yaml .

EXPOSE 9090
CMD [ "node", "gateway.js" ]