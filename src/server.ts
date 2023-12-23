/**
 * This is a debug server for testing, 
 * down below you can edit the config to test the logger settings
*/

import express from "express";
import cors from 'cors'
import { LoggerRoute } from "./expressRoute";
import { getDBStringDebug } from "./prisma";



console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
const app = express();
app.use(express.json());
app.use(cors());
app.disable('x-powered-by');
app.use('/db', LoggerRoute);


function getPort() {
    const loggerPort = Number(process?.env["LOGGER_PORT"])
    if (!isNaN(loggerPort)) {
        console.log("detected logger port: ", loggerPort)
        return loggerPort;
    }
    const serverPort = Number(process.env?.["SERVER_PORT"])
    if (!isNaN(serverPort)) {
        console.log("detected sever port: ", serverPort)
        return Number(serverPort)
    }
    console.log("using default port: ", 3000);
    return 3000;
}

const port = getPort();
console.log(getDBStringDebug(process.env?.["LOG_DATABASE_URL"]));
const loggerServer = app.listen(port, () => { console.log(`Logger Server Start on Port ${port}\n\n`) });
export default loggerServer;

