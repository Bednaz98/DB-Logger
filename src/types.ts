import { JsonMask2Configs, JsonMaskOptions } from 'maskdata'
import { General, Warning, Verbose, Error } from "@prisma/client";
export { General, Warning, Verbose, Error };


export enum LogType {
    verbose,
    general,
    warning,
    error,
}

type LogFunction = (title: string, message?: string | JSON | Object) => Promise<void>

export interface LoggerConfig {
    batchLogCount?: number
    filterOptions?: JsonMask2Configs | JsonMaskOptions
    enableDBLog?: boolean,
    LogTypes?: { [type in LogType]?: boolean },
    printConsole?: { [type in LogType]?: boolean },
}

export interface Logger {
    log: (type: LogType, title: string, message?: string | JSON | Object) => Promise<void>
    verbose: LogFunction,
    general: LogFunction,
    warning: LogFunction,
    error: LogFunction,
}