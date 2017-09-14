FROM node:8-alpine
ENV NODE_ENV="production"

# Install wkhtmltopdf
RUN apk add --no-cache \
            xvfb \
            # Additional dependencies for better rendering
            ttf-freefont \
            fontconfig \
            dbus \
            bash \
    && \

    # Install wkhtmltopdf from `testing` repository
    apk add qt5-qtbase-dev \
            wkhtmltopdf \
            --no-cache \
            --repository http://dl-3.alpinelinux.org/alpine/edge/testing/ \
            --allow-untrusted \
    && \

    # Wrapper for xvfb
    mv /usr/bin/wkhtmltopdf /usr/bin/wkhtmltopdf-origin && \
    echo $'#!/usr/bin/env sh\n\
Xvfb :0 -screen 0 1024x768x24 -ac +extension GLX +render -noreset & \n\
DISPLAY=:0.0 wkhtmltopdf-origin $@ \n\
killall Xvfb\
' > /usr/bin/wkhtmltopdf && \
    chmod +x /usr/bin/wkhtmltopdf

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
