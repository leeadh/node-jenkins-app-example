
=== To run a set up of mongoDB instantly ===
docker-compose up --build -d mongodb

=== To run the mongoDB after you push latest ===
docker build -t got:v4 . &&  docker run -d --network=mongo_db_default  --link=mongodb:mongodb -p 4000:4000 got:v4
