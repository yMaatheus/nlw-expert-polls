FROM node:20.11.1-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /home/node/app

COPY package*.json ./

RUN ["npm", "install"] 

COPY . .

RUN ["npx" "prisma" "migrate" "deploy"]

CMD ["npm", "start"]