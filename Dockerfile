FROM node:8.4
ENV NODE_ENV="production"

# Install wkhtmltopdf
COPY wkhtmltopdf /usr/bin/

# Install server deps
COPY server/package.json /usr/src/server/
RUN cd /usr/src/server && npm install --production

# Install client deps
COPY client/package.json /usr/src/client/
RUN cd /usr/src/client && npm install --production

# Copy files (already compiled)
WORKDIR /usr/src
COPY . .

EXPOSE 3000:3000

# Run
WORKDIR /usr/src/server
CMD ["npm", "run", "start"]
