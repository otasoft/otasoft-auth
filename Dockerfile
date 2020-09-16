FROM node:12-alpine as build

WORKDIR /usr/share/otasoft-auth

ADD dist package.json ./

RUN yarn install --production

FROM node:12-alpine

WORKDIR /usr/share/otasoft-auth

COPY --from=build /usr/share/otasoft-auth .

EXPOSE 60231

CMD ["node", "main.js"]