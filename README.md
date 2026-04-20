// ставим докер контейнер

> docker run -d --name mongo -p 27018:27017 -v mongo-data:/data/db mongo:7