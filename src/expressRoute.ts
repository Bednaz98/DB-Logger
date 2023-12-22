import { LoggingResponseObject, ServerAuthErrorCode, sendGenericError } from '@jabz/server-communication';
import { Logging } from '@jabz/server-communication/lib/axios/types-request';
import { Router } from 'express'
import { SaveLogs } from './SaveLogs';


export const LoggerRoute = Router();



LoggerRoute.post("/log", async (req, res) => {
    try {
        const body: Logging = req.body;
        const logData = body.logData;
        const application = body.application;
        const environment = body.environment;
        console.debug("incoming request: ", application, environment, body.logData.length)
        const logResult = await SaveLogs(application, environment, logData);
        console.debug("result: ", logResult)
        //@ts-ignore
        const sendLogResponse: LoggingResponseObject = { successCount: logResult };
        return res.status(201).send(sendLogResponse);

    } catch (error) {
        console.error(error)
        return sendGenericError(res, ServerAuthErrorCode.serverError);
    }

});



