FROM node:latest
ENV MONGODB_URL=${MONGODB_URL}
WORKDIR /app
COPY package.json /app
COPY . /app
RUN npm install
ADD http://security.ubuntu.com/ubuntu/pool/main/i/icu/libicu55_55.1-7ubuntu0.4_amd64.deb ./
RUN dpkg -i libicu55_55.1-7ubuntu0.4_amd64.deb
RUN apt-get update
RUN apt-get install vim libmcrypt-dev -y
RUN apt-get install curl -y
EXPOSE 4000
CMD ["node", "app.js"]
