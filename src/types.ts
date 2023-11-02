import { JsonMask2Configs, JsonMaskOptions } from 'maskdata'
import { Log } from "@prisma/client";
export { Log };


export enum LogType {
    verbose,
    general,
    warning,
    error,
}

export interface LoggerConfig {
    batchLogCount?: number
    filterOptions?: JsonMask2Configs
    enableDBLog?: boolean,
    printConsole?: boolean,
    sessionID?: string
}

export interface Logger {
    log: (title: string, message?: (string | JSON | Object), tags?: string[]) => Promise<void>
    batchLogs: (logs: Log[]) => Promise<boolean>
    batchSendLogs: () => Promise<boolean>
}

export type LogData = Log


export type LogFilter = {
    title?: string
    tags?: string[]
    minTimeStamp?: number
    maxTimeStamp?: number
    message?: string
}

export interface LoggerFetch {
    getLogs: (logTypes: LogType, filter?: LogFilter) => Promise<LogData[] | null>
}