FROM node:16-alpine
WORKDIR /app
COPY package*.json /app
RUN npm install

COPY . .
RUN npm run build
EXPOSE 4200
CMD ["npm", "run", "start"]