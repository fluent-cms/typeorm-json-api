import { getScopeFilter } from "../decorators/authorize.decorator";
import { Response } from "express";
import { Repository } from "typeorm";
import { LogLevel } from "../routers/crudRouter";
import { parseQueryParam } from "./queryParams"
import { UnAuthorized } from "./errors";

export function mountHandler(router, getRepo: (repoName: string) => Promise<Repository<any>>,
    log: (level: LogLevel, msg: any) => void) {
    async function execute(res: Response, cb) {
        try {
            await cb()
        } catch (error) {
            log('error', error.message)
            if (error instanceof UnAuthorized) {
                res.status(401).send()
            } else {
                res.status(500).send(error.message)
            }
        }
    }

    router.get('/:repoName', async (req, res: Response) => {
        await execute(res, async () => {
            const { repoName } = req.params
            const repo = await getRepo(repoName)
            const scopFilter = getScopeFilter(repo.metadata.name, 'read', req.user)
            const findOption = parseQueryParam(req.query)
            findOption.where = { ...findOption.where, ...scopFilter }
            log('trace', `get repo=${repo.metadata.name}`)
            log('trace', findOption)
            const result = await repo.findAndCount(findOption)
            res.json(result)

        })
    })
    router.get('/:repoName/:id', async (req, res: Response) => {
        await execute(res, async () => {
            const { id, repoName } = req.params
            const repo = await getRepo(repoName)
            const scopFilter = getScopeFilter(repo.metadata.name, 'read', req.user)
            log('trace', `get repo=${repo}, id=${id}`)
            const item = await repo.findOne({ ...scopFilter, id })
            if (!item) {
                res.sendStatus(401)
            } else {
                res.json(item)
            }
        })
    })
    router.post("/:repoName", async function (req, res: Response) {
        await execute(res, async () => {
            const { repoName } = req.params
            const repo = await getRepo(repoName)
            const scopFilter = getScopeFilter(repo.metadata.name, 'create', req.user)

            log('trace', `post repo=${repo.metadata.name}`)
            const item = await repo.create(req.body);

            for (const col of Object.keys(scopFilter)) {
                const arr = scopFilter[col]._value as any[]
                if (!arr.includes(item[col])) {
                    log('trace', `unauthorized, column=${col}, val=${item[col]}, val should in ${arr.reduce((x, y) => x + ',' + y, '')}`)
                    return res.status(401)
                }
            }
            const results = await repo.save(item);
            return res.send(results);
        })
    });

    router.put("/:repoName/:id", async function (req, res: Response) {
        await execute(res, async () => {
            const { id, repoName } = req.params
            const repo = await getRepo(repoName)
            const scopFilter = getScopeFilter(repo.metadata.name, 'update', req.user)
            log('trace', `put repo=${repo.metadata.name}, id=${id}`)
            const item = await repo.findOne({ ...scopFilter, id });
            if (!item) {
                res.status(401)
            } else {
                repo.merge(item, req.body);
                const results = await repo.save(item as any);
                res.send(results);
            }
        })


    });

    router.delete("/:repoName/:id", async function (req, res: Response) {
        await execute(res, async () => {
            const { id, repoName } = req.params
            log('trace', `delete repo=${repoName}, id=${id}`)

            const repo = await getRepo(repoName)
            const scopFilter = getScopeFilter(repo.metadata.name, 'delete', req.user)
            log('trace', scopFilter)
            const item = await repo.findOne({ ...scopFilter, id });
            if (!item) {
                log('trace', `not found, id=${id}`)
                res.status(403).send()
            } else {
                const results = await repo.delete(id);
                res.send(results);
            }
        })

    });
} 