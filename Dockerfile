FROM node:8.4
ENV NODE_ENV="production"

# Install wkhtmltopdf
COPY wkhtmltopdf /usr/bin/
WORKDIR /usr/bin
RUN chmod a+x wkhtmltopdf

# Install server deps
COPY server/package.json /usr/src/server/
WORKDIR /usr/src/server
RUN npm install --production

# Install client deps
COPY client/package.json /usr/src/client/
WORKDIR /usr/src/client
RUN npm install --production

# Copy files (already compiled)
WORKDIR /usr/src
COPY . .

EXPOSE 3000:3000

# Run
WORKDIR /usr/src/server
CMD ["npm", "run", "start"]
