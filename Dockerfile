FROM cypress/base:14.7.0
RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY .eslintrc.js .stylelintrc.js babel.config.js cypress.json webpack.common.js webpack.dev.js .stylelintignore ./
