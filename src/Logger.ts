import { v4 } from "uuid";
import { LogType, Logger, LoggerConfig, Log } from "./types";
import maskData from 'maskdata';

import objectHash from "object-hash";
import { prisma } from "./prisma";

const jsonMaskConfig: maskData.JsonMask2Configs = {
    cardFields: ['credit', 'debit'],
    emailFields: ['primaryEmail', 'secondaryEmail'],
    passwordFields: ['password'],
    phoneFields: ['homePhone', 'workPhone'],
    stringMaskOptions: {
        maskWith: "*",
        maskOnlyFirstOccurance: false,
        values: ["This"]
    },
    stringFields: ['addressLine1', 'addressLine2'],
    //uuidFields: ['uuid1']
};

export default class DBLogger implements Logger {
    private config: LoggerConfig | undefined;
    private LogData: Log[] = []
    private loggerSessionID = v4()
    constructor(initConfig?: LoggerConfig) {
        this.config = initConfig;
    }

    generateID() {
        const ran = v4();
        const now = Date.now();
        const math = Math.random() * 10000000;
        return objectHash({ now, ran, math, session: this.loggerSessionID, });
    }
    defaultProps() {
        const date = new Date();
        return ({
            id: this.generateID(),
            displayTimeStamp: date.toUTCString(),
            timeStamp: BigInt(date.getTime()),
        })

    }
    async batchLogs(logs: Log[]) {
        const send = logs.filter(e => e?.title && e?.sessionID).map((e): Log => ({ ...e, ... this.defaultProps() }))
        this.LogData = [...this.LogData, ...send];
        if (this.shouldSend()) return await this.batchSendLogs().then(() => true);
        else return false;
    }

    private shouldSend() {
        const value = this.config?.batchLogCount;
        if (value === undefined) return true
        else if (this.LogData.length > value) return true
        else return false
    }
    private clearLogs() { this.LogData = [] }

    async log(sessionID: string, title: string, message?: string | Object | JSON | undefined, tags?: string[]) {
        const filterOptions: maskData.JsonMask2Configs = (this.config?.filterOptions ?? jsonMaskConfig)
        const tempMessage = maskData.maskJSON2(message ?? {}, filterOptions);
        const data: Log = {
            sessionID, title, message: JSON.stringify(tempMessage), tags: (tags ?? []),
            ... this.defaultProps()
        }
        if (this.config?.printConsole) console.log(data);
        this.LogData.push(data);
        if (this.shouldSend()) await this.batchSendLogs()
    }
    async batchSendLogs() {
        try {
            const data = [...this.LogData]
            this.clearLogs()
            console.log("Ids: ", data.map(e => e.id))
            if (data.length) {
                await prisma.log.createMany({ data })
                return true
            }
            else return false

        } catch (error) {
            await prisma.log.create({
                data: {
                    ... this.defaultProps(), title: "batch log error",
                    //@ts-ignore
                    message: (error?.message),
                    tags: ["type: error"]
                }
            })
            console.log(error)
            return false
        }
    }

}