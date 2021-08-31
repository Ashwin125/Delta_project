FROM ubuntu 

ENV TZ=Asia/Kolkata

RUN apt-get update 

RUN apt-get install gcc -y

RUN apt-get install g++ -y

RUN apt-get install python3 -y

RUN apt-get install default-jre -y
RUN apt-get install default-jdk -y

RUN apt-get install nodejs -y
RUN apt-get install npm -y

 
RUN mkdir /web_app
COPY . /web_app
WORKDIR /web_app

RUN npm install

CMD node connect.js && tail -F anything
