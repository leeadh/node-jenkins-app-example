FROM node:latest
ENV MONGODB_URL=${MONGODB_URL}
WORKDIR /app
COPY package.json /app
COPY . /app
RUN npm install 
EXPOSE 4000
CMD ["node", "app.js"]
