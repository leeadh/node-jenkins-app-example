
=== To run a set up of mongoDB instantly ===
docker-compose up --build -d mongodb

=== To run the mongoDB after you push latest ===
docker build -t got:v5 . &&  docker run -d --network=mongo_db_default  --link=mongodb:mongodb -p 4000:4000 got:v5



=== To run the docker app and connection to mongo DB container===
docker run -d --network=mongo_db_default  --link=mongodb:mongodb -e "MONGODB_URL=mongodb://mongodb/user" -p 4000:4000 e922a127d049
docker run -d --network=mongo_db_default  --link=mongodb:mongodb -e MONGODB_URL='mongodb://54.169.159.201:27017/user' -p 4000:4000 e922a127d049 

MONGODB_URL=mongodb://127.0.0.1:27017/user node app.js
