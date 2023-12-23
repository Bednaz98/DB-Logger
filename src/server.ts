/**
 * This is a debug server for testing, 
 * down below you can edit the config to test the logger settings
*/

import express from "express";
import cors from 'cors'
import { LoggerRoute } from "./expressRoute";



console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
const app = express();
app.use(express.json());
app.use(cors());
app.disable('x-powered-by');
app.use('/db', LoggerRoute);

function getDBStringDebug() {
    const dbString = process.env?.["LOG_DATABASE_URL"]
    if (!dbString) return "N/A";
    const firstSplit = dbString.split('://')
    const dbType = firstSplit[0]
    const ipAddress = firstSplit[1].split(':')[1].split("@")[1]
    const port = firstSplit[1].split(':')[2].split("/")[0]

    return (`\n- db type: ${dbType}\n- host ip: ${ipAddress}:${port}`);
}

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
console.log(getDBStringDebug());
app.listen(port, () => { console.log(`Logger Server Start on Port ${port}`) });
