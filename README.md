# DB-Logger-Client

This project is a simple logging server. It has one singular endpoint to post logs to. Those logs are then pushed to a database that is supported by Prisma. 
The idea is ot create a platform agnostic service that can be leveraged in any cloud enviorment that supports a run time node server.
The choice to use Prisma allows for multiple databases to be utilized allowing for more flexibility in usage. 
Currently this repo contains a docker contain that can be pulled and used in a cloud enviorement. The container is configurable to allow for platform agnostic deployment. 

In the docker-compose file, postgres confugrations are provided as a quick setup.


## expected usage

A client should create a post request to the logger server with the following body:
