import { prisma } from "./prisma";
import { LogData, LogFilter, LogType, LoggerFetch } from "./types";


export default class DBLoggerFetch implements LoggerFetch {

    logFilter(result: LogData[], filter?: LogFilter) {
        if (filter?.title) result = result.filter((e) => e.title.includes(filter?.title ?? ""))
        if (filter?.message) result = result.filter((e) => e.message?.includes(filter?.message ?? ""))
        if (filter?.tags) {
            result = result.filter((e) => {
                let check: boolean[] = []
                check.push(...e.tags.map((s) => filter?.tags?.includes(s) ?? false));
                return check.includes(true)
            })
        }
        if (filter?.minTimeStamp) result = result.filter((e) => (e.timeStamp ?? 0) >= (filter?.minTimeStamp ?? 0))
        if (filter?.maxTimeStamp) result = result.filter((e) => (e.timeStamp ?? 0) <= (filter?.maxTimeStamp ?? 0))
        return result

    }
    async getLogs(logTypes: LogType, filter?: LogFilter) {

        (await prisma.error.findMany()) as unknown as LogData[]
        switch (logTypes) {
            case LogType.error: {
                let result = (await prisma.error.findMany()) as unknown as LogData[]
                return this.logFilter(result, filter);
            }
            case LogType.general: {
                let result = (await prisma.general.findMany()) as unknown as LogData[]
                return this.logFilter(result, filter);
            }
            case LogType.verbose: {
                let result = (await prisma.verbose.findMany()) as unknown as LogData[]
                return this.logFilter(result, filter);
            }
            case LogType.warning: {
                let result = (await prisma.warning.findMany()) as unknown as LogData[]
                return this.logFilter(result, filter);
            }
            default: {
                let error = prisma.error.findMany();
                let general = prisma.error.findMany();
                let warn = prisma.error.findMany();
                let verbose = prisma.error.findMany();
                const result = (await prisma.$transaction([error, general, warn, verbose])) as unknown as LogData[];
                const func = (a: LogData, b: LogData) => (b.timeStamp - a.timeStamp) as unknown as number;
                return this.logFilter(result, filter).sort(func);
            }
        }
    }

}