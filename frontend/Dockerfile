# base image
FROM node:lts-alpine

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY package*.json ./

# install dependencies
RUN npm install

# copy project files and folders to the current working directory
COPY . .

# listen to port 8080
EXPOSE 8080
