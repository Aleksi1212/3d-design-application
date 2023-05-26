FROM --platform=amd64 node:18-bullseye

WORKDIR /src/app

COPY package.json package-lock.json ./

COPY . .

RUN npm install
RUN npm run build
