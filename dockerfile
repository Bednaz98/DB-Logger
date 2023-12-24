FROM node:18-alpine
WORKDIR /usr/app
COPY ./ /usr/app

ARG EXPOSE_PORT=3000
ARG LOGGER_ENV="DEV"
ARG LOG_DATABASE_URL="postgresql://postgres:exmaple@localhost:5432/log"
ENV LOGGER_PORT=${EXPOSE_PORT}
ENV LOG_DATABASE_URL=${LOG_DATABASE_URL}
ENV DB_LOGGER_ENVIORMENT=${LOGGER_ENV}
RUN npm install
RUN npm uninstall prisma
RUN npm install prisma
RUN npx prisma generate
EXPOSE ${EXPOSE_PORT}
CMD ["npm", "start"]