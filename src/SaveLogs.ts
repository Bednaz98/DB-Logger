import { ClientLogData } from "@jabz/server-communication/lib/axios/types-request";
import { prisma } from "./prisma";
import { Log } from "@prisma/client"
import { v4 } from "uuid";
import { defaultAPI_Tags } from "./apiLoggerDefaultTags";




export async function SaveLogs(applicationName: string, environment: string, incomingLogs: ClientLogData[]) {
    const serverTimeStamp = Date.now();
    const current = (new Date(serverTimeStamp)).toUTCString();
    const data: Log[] = incomingLogs.map(e => {
        const temp: Log = {
            ...e,
            id: `${current} -- ${v4()}`,
            clientTimeStamp: BigInt(e.clientTimeStamp),
            applicationName,
            environment,
            displayTimeStamp: current,
            serverTimeStamp: BigInt(serverTimeStamp),
            message: e.message ?? null,
            logLevel: JSON.stringify(e.logLevel),
            tags: [...e.tags, ...defaultAPI_Tags]
        }
        return temp
    })
    const response = await prisma.log.createMany({ data });
    return response.count;
}