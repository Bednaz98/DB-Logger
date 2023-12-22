import { PrismaClient } from '@prisma/client';


const getPrisma = (): PrismaClient => {
    try {
        return new PrismaClient({
            datasources: {
                db: {
                    url: process?.env?.["LOG_DATABASE_URL"],
                },
            },
        })
    } catch (error) {
        return new PrismaClient()
    }

}

export const prisma = getPrisma();