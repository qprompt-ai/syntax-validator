FROM node:20-alpine

WORKDIR /opt/validator

COPY package*.json ./
COPY packages/core/package.json packages/core/package.json
COPY packages/validators/cypress/package.json packages/validators/cypress/package.json

RUN npm install

COPY packages/core packages/core
COPY packages/validators/cypress packages/validators/cypress

RUN chmod +x packages/validators/cypress/bin/validate-cypress

ENV PATH="/opt/validator/packages/validators/cypress/bin:${PATH}"

ENTRYPOINT ["validate-cypress"]
