/**
 * This is a debug server for testing, 
 * down below you can edit the config to test the logger settings
*/

import express from "express";
import cors from 'cors'
import { LoggerRoute } from "./expressRoute";




const app = express();
app.use(express.json());
app.use(cors());
app.disable('x-powered-by');
app.use('/db', LoggerRoute);

function getPort() {
    const loggerPort = process?.env["LOGGER_PORT"]
    if (loggerPort) return Number(loggerPort)
    const serverPort = process.env?.["SERVER_PORT"]
    if (serverPort) return Number(serverPort)
    return 3000
}
const port = getPort();

app.listen(port, () => { console.log(`Logger Server Start on Port ${port}`) });