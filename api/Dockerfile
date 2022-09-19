FROM node:16-alpine

WORKDIR /app
COPY ./package*.json ./
RUN npm i
COPY . .

EXPOSE 3333

ENTRYPOINT ["npm", "run"]
CMD ["start"]
