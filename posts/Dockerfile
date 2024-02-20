FROM node:alpine

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./
# dockerignore file will make sure the node_modules directory gets ignored


CMD ["npm", "start"]