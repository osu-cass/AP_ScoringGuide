FROM debian:9
ENV NODE_ENV="production"

# Install node
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y gnupg
RUN apt-get install -y libfontconfig1 libxrender1
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install -y nodejs

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
