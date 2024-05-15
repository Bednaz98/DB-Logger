# DB-Logger-Client

This project is a simple logging server. It has one singular endpoint to post logs to. Those logs are then pushed to a database that is supported by Prisma. 
The idea is to create a platform-agnostic service that can be leveraged in any cloud environment that supports a run time node server.
The choice to use Prisma allows for multiple databases to be utilized allowing for more flexibility in usage. 
Currently, this repo contains a docker that can be pulled and used in a cloud environment. The container is configurable to allow for platform-agnostic deployment. 

In the docker-compose file, Postgres configurations are provided as a quick setup.


## expected usage

A client should create a post request to the logger server with the following body:

``` JavaScript
{
    clientLogId: string;
    clientTimeStamp: number;
    logLevel: LogLevel[];
    sessionID: string;
    title: string;
    message?: string;
    tags: string[];
}
```

