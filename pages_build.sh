#!/usr/bin/env bash

yarn intl:build
yarn build-web

# build system outputs some srcs and hrefs like src="static/"
# need to rewrite to be src="/static/" to handle non root pages
sed -i 's/\(src\|href\)="static/\1="\/static/g' web-build/index.html

# we need to copy the static iframe html to support youtube embeds
cp -r bskyweb/static/iframe/ web-build/iframe
