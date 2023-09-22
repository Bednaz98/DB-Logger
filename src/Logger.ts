import { v4 } from "uuid";
import { General, LogType, Logger, LoggerConfig, Verbose, Warning, Error } from "./types";
import MaskData from 'maskdata';

import objectHash from "object-hash";
import { prisma } from "./prisma";

export default class DBLogger implements Logger {
    private config: LoggerConfig | undefined;
    private LogData: { [type in LogType]?: (General[] | Warning[] | Verbose[] | Error[]) } = {}
    constructor(initConfig?: LoggerConfig) {
        this.config = initConfig;
    }

    async sendLogs() {
        try {
            console.log("all logs ", this.LogData)
            const genTrans = prisma.general.createMany({ data: this.LogData[LogType.general] ?? [] })
            const verbTrans = prisma.verbose.createMany({ data: this.LogData[LogType.verbose] ?? [] })
            const warnTrans = prisma.warning.createMany({ data: this.LogData[LogType.warning] ?? [] })
            const errTrans = prisma.error.createMany({ data: this.LogData[LogType.error] ?? [] })
            return Boolean(await prisma.$transaction([genTrans, verbTrans, warnTrans, errTrans]))
        } catch (error) {
            console.error('Logger Transaction failed: ', error)
            return false
        }

    }

    private async addLogBatch(logType: LogType, log: General | Warning | Verbose | Error) {
        switch (logType) {
            case LogType.general: {
                const data = this.LogData[LogType.general] ?? []
                this.LogData[LogType.general] = [...data, log]
                break;
            }
            case LogType.verbose: {
                const data = this.LogData[LogType.verbose] ?? []
                this.LogData[LogType.verbose] = [...data, log]
                break;
            }
            case LogType.error: {
                const data = this.LogData[LogType.error] ?? []
                this.LogData[LogType.error] = [...data, log]
                break;
            }
            case LogType.warning: {
                const data = this.LogData[LogType.warning] ?? []
                this.LogData[LogType.warning] = [...data, log]
                break;
            }
        }
        const eCount = this.LogData[LogType.error]?.length ?? 0;
        const eVerb = this.LogData[LogType.verbose]?.length ?? 0;
        const eWarn = this.LogData[LogType.warning]?.length ?? 0;
        const eGen = this.LogData[LogType.general]?.length ?? 0;
        if (this.config?.batchLogCount === undefined) {
            await this.sendLogs()
                .then(() => { this.LogData = {} });
        }
        else if (eCount + eVerb + eWarn + eGen >= this.config?.batchLogCount) {
            await this.sendLogs()
                .then(() => { this.LogData = {} });
        }
    }

    private generateLog(sessionID: string, title: string, message?: string | Object | JSON | undefined, tags?: string[]): (General | Warning | Verbose | Error) {
        let tempMessage: string = "N/A"
        if (typeof message === "string") {
            tempMessage = message;
        }
        else if (typeof message === "object") {
            tempMessage = JSON.stringify(message);
        }
        const index = `${this.LogData[0]?.length ?? 0}${this.LogData[1]?.length ?? 0}${this.LogData[2]?.length ?? 0}${this.LogData[3]?.length ?? 0}`;
        const id = `${Date.now()} - ${objectHash({ title, message, temp: v4(), time: Date.now(), tags, index })}`
        return { sessionID, title, message: tempMessage, timeStamp: BigInt(Date.now()), id, tags: tags ?? [], displayTimeStamp: (new Date(Date.now())).toUTCString() }
    }
    private consolePrint(logType: LogType, log: (General | Warning | Verbose | Error)) {
        let print = (..._params: any) => { }
        switch (logType) {
            case LogType.error: { print = console.error; break }
            case LogType.warning: { print = console.warn; break }
            case LogType.general: { print = console.info; break }
            case LogType.verbose: { print = console.debug; break }
            default: { print = console.log; break }
        }
        print(log)
    }

    private async HandleLog(type: LogType, sessionID: string, title: string, message?: string | Object | JSON | undefined, tags?: string[]) {
        const filter = this.config?.filterOptions
        const filteredLog = MaskData.maskJSON2({ title, message }, filter as MaskData.JsonMask2Configs);
        const genLog = this.generateLog(sessionID, filteredLog.title, filteredLog?.message, tags)
        this.config?.enableDBLog === undefined ? await this.addLogBatch(type, genLog) : (
            this.config?.enableDBLog ? await this.addLogBatch(type, genLog) : null
        );
        this.config?.printConsole ? this.consolePrint(type, genLog) : null;
    }
    async log(type: LogType, sessionID: string, title: string, message?: string | Object | JSON | undefined, tags?: string[]): Promise<void> {
        await this.HandleLog(type, sessionID, title, message)
    };
    async verbose(sessionID: string, title: string, message?: string | Object | JSON | undefined, tags?: string[]): Promise<void> {
        await this.HandleLog(LogType.verbose, sessionID, title, message, tags)
    };
    async general(sessionID: string, title: string, message?: string | Object | JSON | undefined, tags?: string[]): Promise<void> {
        await this.HandleLog(LogType.general, sessionID, title, message, tags)
    };
    async warning(sessionID: string, title: string, message?: string | Object | JSON | undefined, tags?: string[]): Promise<void> {
        await this.HandleLog(LogType.warning, sessionID, title, message, tags)
    };
    async error(sessionID: string, title: string, message?: string | Object | JSON | undefined, tags?: string[]): Promise<void> {
        await this.HandleLog(LogType.error, sessionID, title, message, tags)
    };

}