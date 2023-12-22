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
const port = Number((process.env?.["SERVER_PORT"] ?? process?.env["LOGGER_PORT"]) ?? 3000);

app.listen(port, () => { console.log(`Logger Server Start on Port ${port}`) });