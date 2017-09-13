FROM node:8.4
ENV NODE_ENV="production"

# Install server deps
COPY server/package.json /usr/src/server/
RUN cd /usr/src/server && npm install --production

# Install client deps
COPY client/package.json /usr/src/client/
RUN cd /usr/src/client && npm install --production

# Compile Typescript
WORKDIR /usr/src
COPY . .
# RUN cd /usr/src/server && yarn run build
# RUN cd /usr/src/client && yarn run build && yarn run less

EXPOSE 3000:3000

# Run
WORKDIR /usr/src/server
CMD ["npm", "run", "start"]
