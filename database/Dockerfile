FROM mysql:5.7

MAINTAINER me

ENV MYSQL_DATABASE==whitelist \
    MYSQL_ROOT_PASSWORD==password

ADD schema.sql /docker-entrypoint-initdb.d

EXPOSE 3306