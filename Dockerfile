FROM golang:1.22-bullseye AS build-env

WORKDIR /usr/src/social-app

ENV DEBIAN_FRONTEND=noninteractive

# Node
ENV NODE_VERSION=18
ENV NVM_DIR=/usr/share/nvm

# Go
ENV GODEBUG="netdns=go"
ENV GOOS="linux"
ENV GOARCH="amd64"
ENV CGO_ENABLED=1
ENV GOEXPERIMENT="loopvar"

# Expo
ARG EXPO_PUBLIC_BUNDLE_IDENTIFIER
ENV EXPO_PUBLIC_BUNDLE_IDENTIFIER=${EXPO_PUBLIC_BUNDLE_IDENTIFIER:-dev}
ARG EXPO_PUBLIC_STAGING_SERVICE
ENV EXPO_PUBLIC_STAGING_SERVICE=${EXPO_PUBLIC_STAGING_SERVICE}
ARG EXPO_PUBLIC_BSKY_SERVICE
ENV EXPO_PUBLIC_BSKY_SERVICE=${EXPO_PUBLIC_BSKY_SERVICE}
ARG EXPO_PUBLIC_PUBLIC_BSKY_SERVICE
ENV EXPO_PUBLIC_PUBLIC_BSKY_SERVICE=${EXPO_PUBLIC_PUBLIC_BSKY_SERVICE}
ARG EXPO_PUBLIC_DEFAULT_FEED
ENV EXPO_PUBLIC_DEFAULT_FEED=${EXPO_PUBLIC_DEFAULT_FEED}
ARG EXPO_PUBLIC_DISCOVER_FEED_URI
ENV EXPO_PUBLIC_DISCOVER_FEED_URI=${EXPO_PUBLIC_DISCOVER_FEED_URI}

#
# Generate the JavaScript webpack.
#
RUN mkdir --parents $NVM_DIR && \
  wget \
    --output-document=/tmp/nvm-install.sh \
    https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh && \
  bash /tmp/nvm-install.sh

RUN \. "$NVM_DIR/nvm.sh" && \
  nvm install $NODE_VERSION && \
  nvm use $NODE_VERSION && \
  echo "Using bundle identifier: $EXPO_PUBLIC_BUNDLE_IDENTIFIER" && \
  echo "EXPO_PUBLIC_BUNDLE_IDENTIFIER=$EXPO_PUBLIC_BUNDLE_IDENTIFIER" >> .env && \
  echo "EXPO_PUBLIC_BUNDLE_DATE=$(date -u +"%y%m%d%H")" >> .env && \
  npm install --global yarn

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./lib/react-compiler-runtime ./lib/react-compiler-runtime
COPY ./lingui.config.js ./lingui.config.js
COPY ./src/locale/locales ./src/locale/locales

RUN \. "$NVM_DIR/nvm.sh" && \
  nvm use $NODE_VERSION && \
  yarn install

RUN \. "$NVM_DIR/nvm.sh" && \
  nvm use $NODE_VERSION && \
  yarn intl:build

COPY ./bskyweb/go.mod ./bskyweb/go.mod
COPY ./bskyweb/go.sum ./bskyweb/go.sum

RUN cd bskyweb/ && \
  go mod download && \
  go mod verify

COPY . .

RUN \. "$NVM_DIR/nvm.sh" && \
  nvm use $NODE_VERSION && \
  yarn install && \
  EXPO_PUBLIC_STAGING_SERVICE=$EXPO_PUBLIC_STAGING_SERVICE \
  EXPO_PUBLIC_BSKY_SERVICE=$EXPO_PUBLIC_BSKY_SERVICE \
  EXPO_PUBLIC_PUBLIC_BSKY_SERVICE=$EXPO_PUBLIC_PUBLIC_BSKY_SERVICE \
  EXPO_PUBLIC_DEFAULT_FEED=$EXPO_PUBLIC_DEFAULT_FEED \
  EXPO_PUBLIC_DISCOVER_FEED_URI=$EXPO_PUBLIC_DISCOVER_FEED_URI \
  EXPO_PUBLIC_BUNDLE_IDENTIFIER=$EXPO_PUBLIC_BUNDLE_IDENTIFIER EXPO_PUBLIC_BUNDLE_DATE=$() yarn build-web

# luna: this should generate a scripts.html
RUN find ./bskyweb/templates/scripts.html
# DEBUG
RUN find ./bskyweb/static && find ./web-build/static

#
# Generate the bskyweb Go binary.
#

RUN cd bskyweb/ && \
  go build \
    -v  \
    -trimpath \
    -tags timetzdata \
    -o /bskyweb \
    ./cmd/bskyweb

FROM debian:bullseye-slim

ENV GODEBUG=netdns=go
ENV TZ=Etc/UTC
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install --yes \
  dumb-init \
  ca-certificates

ENTRYPOINT ["dumb-init", "--"]

WORKDIR /bskyweb
COPY --from=build-env /bskyweb /usr/bin/bskyweb

CMD ["/usr/bin/bskyweb"]

LABEL org.opencontainers.image.source=https://github.com/bluesky-social/social-app
LABEL org.opencontainers.image.description="bsky.app Web App"
LABEL org.opencontainers.image.licenses=MIT

# NOOP
