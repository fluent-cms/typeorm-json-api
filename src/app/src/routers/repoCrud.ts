import { Request, Response } from "express";
import express from "express";
import { Connection, ConnectionOptions, createConnection } from "typeorm";
import { parseQueryParam } from "./queryPrarms";

export enum LogLevel {
    error = 1,
    trace = 2
}

let logger = (level:LogLevel, msg) => {
    console.log(`***** in repo CRUD router, level = ${level}` )
    console.log(msg)
}

const log =(level,msg) => logger && logger(level,msg)

let repoOrmConfig: ConnectionOptions

export function setCRUDRouter(ormConfig: any, routerLogger: (level:LogLevel,msg:any)=>void = logger) {
    repoOrmConfig = ormConfig
    logger = routerLogger
}

let repoConn: Connection
async function getConnection() {
    try {
        repoConn = repoConn ?? await createConnection(repoOrmConfig)
        return repoConn
    } catch (error) {
        log(LogLevel.error, error)
        throw error
    }
}

async function getRepo(req: Request) {
    try {
        const conn = await getConnection()
        const repoName = req.params.repo
        const repo = await conn.getRepository(repoName)
        return repo
    } catch (error) {
        log(LogLevel.error, error)
        throw error
    }
}

export const repoRouter = express.Router()
repoRouter.use(express.json())

repoRouter.get('/:repo', async (req, res) => {
    try {
        const findOption = parseQueryParam(req.query)
        const repo = await getRepo(req)
        log(LogLevel.trace,`get repo=${repo.metadata.name}`)
        log(LogLevel.trace,findOption)
        const result = await repo.findAndCount(findOption)
        res.json(result)
    } catch (error) {
        log(LogLevel.error, error)
        throw error
    }
})

repoRouter.get('/:repo/:id', async (req: Request, res: Response) => {
    try {
        const repo = await getRepo(req)
        const id = req.params.id
        log(LogLevel.trace,`get repo=${repo}, id=${id}`)
        const item = await repo.findOne(id)
        if (!item) {
            res.sendStatus(401)
        }
        res.json(item)
    } catch (error) {
        log(LogLevel.error, error)
        throw error
    }
})

repoRouter.post("/:repo", async function (req: Request, res: Response) {
    try {
        const repo = await getRepo(req)
        log(LogLevel.trace,`post repo=${repo.metadata.name}`)
        const item = await repo.create(req.body);
        const results = await repo.save(item);
        return res.send(results);
    } catch (error) {
        log(LogLevel.error, error)
        throw error
    }
});

repoRouter.put("/:repo/:id", async function (req: Request, res: Response) {
    try {
        const repo = await getRepo(req)
        const id = req.params.id
        log(LogLevel.trace,`put repo=${repo.metadata.name}, id=${id}`)
        const user = await repo.findOne(id);
        repo.merge(user, req.body);
        const results = await repo.save(user as any);
        return res.send(results);
    } catch (error) {
        log(LogLevel.error, error)
        throw error
    }
});

repoRouter.delete("/:repo/:id", async function (req: Request, res: Response) {
    try {
        const repo = await getRepo(req)
        const id = req.params.id
        log(LogLevel.trace,`delete repo=${repo.metadata.name}, id=${id}`)
        const results = await repo.delete(id);
        return res.send(results);
    } catch (error) {
        log(LogLevel.error, error)
        throw error
    }
});
