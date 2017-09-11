FROM node:8.4

# Install server deps
COPY server/package.json server/yarn.lock /usr/src/server/
RUN cd /usr/src/server && yarn install

# Install client deps
COPY client/package.json client/yarn.lock /usr/src/client/
RUN cd /usr/src/client && yarn install

# Compile Typescript
WORKDIR /usr/src
COPY . .
RUN cd /usr/src/server && yarn run build
RUN cd /usr/src/client && yarn run build && yarn run less
ENV PORT=3000
EXPOSE 3000:3000

# Run
WORKDIR /usr/src/server
CMD ["yarn", "run", "start"]