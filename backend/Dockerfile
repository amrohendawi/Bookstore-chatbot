# base image
FROM node:16

# set working directory
WORKDIR /home/node/app

# install and cache app dependencies
COPY package*.json ./

# install dependencies
RUN npm install

RUN npm install -g nodemon 

# copy project files and folders to the current working directory
COPY . .

# listen to port 8000
EXPOSE 8000