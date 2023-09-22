import { Router } from 'express'
import DBLogger from './Logger'
import { LogType, LoggerConfig } from './types'
import DBLoggerFetch from './LoggerFetch';
import { v4 } from 'uuid';

export function initLoggerRoute(initConfig?: LoggerConfig | undefined) {
    const LoggerRoute = Router();

    const Logger = new DBLogger(initConfig);
    const fetchLogger = new DBLoggerFetch()
    const loggerSessionID = v4()


    LoggerRoute.post('/general', async (req, res) => {
        try {
            console.log("body request", req.body)
            const sessionID = req.body?.sessionID ?? "bad response";
            const title = req.body?.title ?? "bad response";
            const message = req.body?.message ?? "bad response";
            const tags = req.body?.tags ?? ["bad response"];
            await Logger.general(sessionID, title, message, tags)
            return res.status(201).send();
        } catch (error) {
            await Logger.error(loggerSessionID, `Logger Server Error - POST General`, (error as any).message).then(async () => await Logger.sendLogs())
            return res.status(500).send()
        }
    })

    LoggerRoute.post('/warn', async (req, res) => {
        try {
            const sessionID = req.body?.sessionID ?? "bad response";
            const title = req.body?.title ?? "bad response";
            const message = req.body?.message ?? "bad response";
            const tags = req.body?.tags ?? ["bad response"];
            await Logger.warning(sessionID, title, message, tags)
            return res.status(201).send();
        } catch (error) {
            await Logger.error(loggerSessionID, `Logger Server Error - POST Warn`, (error as any).message).then(async () => await Logger.sendLogs())
            return res.status(500).send()
        }
    })
    LoggerRoute.post('/error', async (req, res) => {
        try {
            const sessionID = req.body?.sessionID ?? "bad response";
            const title = req.body?.title ?? "bad response";
            const message = req.body?.message ?? "bad response";
            const tags = req.body?.tags ?? ["bad response"];
            await Logger.error(sessionID, title, message, tags)
            return res.status(201).send();
        } catch (error) {
            await Logger.error(loggerSessionID, `Logger Server Error - POST Error`, (error as any).message).then(async () => await Logger.sendLogs())
            return res.status(500).send()
        }
    })
    LoggerRoute.post('/verbose', async (req, res) => {
        try {
            const sessionID = req.body?.sessionID ?? "bad response";
            const title = req.body?.title ?? "bad response";
            const message = req.body?.message ?? "bad response";
            const tags = req.body?.tags ?? ["bad response"];
            await Logger.verbose(sessionID, title, message, tags)
            return res.status(201).send();
        } catch (error) {
            await Logger.error(loggerSessionID, `Logger Server Error - POST Verbose`, (error as any).message).then(async () => await Logger.sendLogs())
            return res.status(500).send()
        }
    })


    LoggerRoute.get('/general', async (req, res) => {
        try {
            const filter = req?.body?.filter;
            return res.status(201).send(JSON.stringify(await fetchLogger.getLogs(LogType.general, filter)))
        } catch (error) {
            Logger.error(loggerSessionID, `Logger Server Error - GET General`, (error as any).message).then(async () => await Logger.sendLogs())
            return res.status(500).send()
        }
    })
    LoggerRoute.get('/warn', async (req, res) => {
        try {
            const filter = req?.body?.filter;
            return res.status(201).send(JSON.stringify(await fetchLogger.getLogs(LogType.warning, filter)))
        } catch (error) {
            Logger.error(loggerSessionID, `Logger Server Error - GET Warn`, (error as any).message).then(async () => await Logger.sendLogs())
            return res.status(500).send()
        }
    })
    LoggerRoute.get('/error', async (req, res) => {
        try {
            const filter = req?.body?.filter;
            return res.status(201).send(JSON.stringify(await fetchLogger.getLogs(LogType.error, filter)))
        } catch (error) {
            //@ts-ignore
            Logger.error(loggerSessionID, `Logger Server Error - GET error`, (error as any).message).then(async () => await Logger.sendLogs())
            return res.status(500).send()
        }
    })
    LoggerRoute.get('/verbose', async (req, res) => {
        try {
            const filter = req?.body?.filter;
            return res.status(201).send(JSON.stringify(await fetchLogger.getLogs(LogType.verbose, filter)))
        } catch (error) {
            Logger.error(loggerSessionID, `Logger Server Error - GET Verbose`, (error as any).message).then(async () => await Logger.sendLogs())
            return res.status(500).send()
        }
    })



    return LoggerRoute;

}




