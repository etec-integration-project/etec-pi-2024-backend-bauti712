FROM node:18-alpine

WORKDIR /myapp
COPY package*.json .

RUN npm install

COPY . .
EXPOSE 3001
CMD ["npm", "start"]
 
