import { prisma } from "./prisma";
import { LogData, LogFilter, LogType, LoggerFetch } from "./types";

/**not complete*/
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
        try {
            const logs = (await prisma.log.findMany()).filter((e) => e.tags.join(',').includes(LogType[logTypes]))
            return this.logFilter(logs, filter)
        } catch (error) {
            return null
        }




    }

}