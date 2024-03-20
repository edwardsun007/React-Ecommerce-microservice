FROM node:alpine
 
# Add the following lines for fixing two known issues in create-react-app
# https://github.com/facebook/create-react-app/issues/11779
# https://github.com/facebook/create-react-app/issues/8688
ENV CI=true
ENV WDS_SOCKET_PORT=0
 
WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./
 
CMD ["npm", "start"]