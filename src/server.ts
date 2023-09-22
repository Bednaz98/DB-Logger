/**
 * This is a debug server for testing, 
 * down below you can edit the config to test the logger settings
*/

import express from "express";
import cors from 'cors'
import { initLoggerRoute } from "./expressRoute";
import { LoggerConfig } from "./types";


const app = express();
app.use(express.json());
app.use(cors());
app.disable('x-powered-by');
const config: LoggerConfig = {}

app.use('/logger', initLoggerRoute(config));
app.get('*', (req, res) => {
    console.log('Server hit')
    res.status(404).send()
})
app.listen(3051, () => { console.log('Logger Server Start on Port 3051') });