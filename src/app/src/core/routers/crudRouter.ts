import { Request, Response } from "express";
import express from "express";
import { Connection, ConnectionOptions, createConnection, getConnectionManager } from "typeorm";
import { mountHandler } from "../utilities/crudHandler";

export type LogLevel = 'error' | 'trace'


export function createCRUDRouter(ormConfig: any, routerLogger = logger, routerAuthHandler = authHandler) {
    repoOrmConfig = ormConfig
    logger = routerLogger
    authHandler = routerAuthHandler

    const crudRouter = express.Router()
    crudRouter.use(express.json())
    if (authHandler) {
        crudRouter.use(authHandler)
    }
    mountHandler(crudRouter, getRepo, log)
    return crudRouter
}

let authHandler = (req: Request, res: Response, next) => next()
let repoOrmConfig: ConnectionOptions
let repoConn: Connection




async function getConnection() {
    try {
        repoConn = repoConn ?? getConnectionManager().get(repoOrmConfig.name ?? 'default')
        repoConn = repoConn ?? await createConnection(repoOrmConfig)
        return repoConn
    } catch (error) {
        log('error', error)
        throw error
    }
}
async function getRepo(repoName:string) {
    try {
        console.log('-----------in get repo, repoName=' + repoName)
        const conn = await getConnection()
        const repo = conn.getRepository(repoName)
        return repo
    } catch (error) {
        log('error', error)
        throw error
    }
}

let logger = (level: LogLevel, msg: any) => {
    console.log(`***** in repo CRUD router, level = ${level}`)
    console.log(msg)
}
const log = (level: LogLevel, msg: any) => logger && logger(level, msg)
