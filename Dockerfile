FROM node:12-alpine as dev

WORKDIR /usr/share/microservices/otasoft-auth

COPY package.json ./

RUN yarn install

RUN apk --no-cache add --virtual builds-deps build-base python && npm rebuild bcrypt --build-from-source

COPY . .

RUN yarn run build

# ADD dist package.json ./

# RUN yarn install --production

# FROM node:12-alpine

# WORKDIR /usr/share/microservices/otasoft-auth

# COPY --from=build /usr/share/microservices/otasoft-auth/dist ./dist

# EXPOSE 60231

# CMD ["node", "dist/main"]