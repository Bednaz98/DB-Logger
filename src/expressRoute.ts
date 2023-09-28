import { Router } from 'express'
import DBLogger from './Logger'
import { Log, LoggerConfig } from './types'
import { v4 } from 'uuid';


export function initLoggerRoute(initConfig?: LoggerConfig | undefined) {
    const LoggerRoute = Router();

    const Logger = new DBLogger(initConfig);
    const loggerSessionID = v4()


    LoggerRoute.post('/singleLog', async (req, res) => {
        try {
            console.log("body request", req.body);
            const sessionID = req.body?.sessionID ?? undefined;
            const title = req.body?.title ?? undefined;
            const message = req.body?.message ?? "N/A";
            const tags: string[] = req.body?.tags ?? [];
            if (sessionID === undefined) return res.status(400).send({ "error": "bad formatting" });
            if (title === undefined) return res.status(400).send({ "error": "bad formatting" });
            await Logger.log(sessionID, title, message, tags);
            return res.status(201).send();
        } catch (error) {
            await Logger.log(
                `Logger Session - ${loggerSessionID}`,
                `Logger Server Error - POST Single Log`,
                (error as any).message,
                ["type:error"]
            )
                .then(async () => await Logger.batchSendLogs());
            return res.status(500).send();
        }
    })

    LoggerRoute.post('/batchLogs', async (req, res) => {
        console.log('batch log called')
        try {
            const logData: Log[] = req?.body as any;
            console.log('Incoming data', logData)
            if (Array.isArray(logData)) {
                if (logData.length > 0) {
                    await Logger.batchLogs(logData)
                    return res.status(201).send()
                }
            }
            return res.status(200).send()
        } catch (error) {
            await Logger.log(
                `Logger Session - ${loggerSessionID}`,
                `Logger Server Error - POST Batch Logs`,
                (error as any).message,
                ["type:error"]
            )
                .then(async () => await Logger.batchSendLogs());
            return res.status(500).send();
        }
    });

    return LoggerRoute;

}




