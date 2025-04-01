FROM node:20

RUN apt-get update

# RUN wget https://github.com/jwilder/dockerize/releases/download/v0.8.0/dockerize-linux-amd64-v0.8.0.tar.gz \
#    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.8.0.tar.gz \
#    && rm dockerize-linux-amd64-v0.8.0.tar.gz

RUN npm i

EXPOSE 3000

# CMD ["dockerize", "-wait", "tcp://db:3306", "-timeout", "30s", "npm", "start"]
CMD ["npm", "start"]
