import { Request, Response } from "express";
import { LogLevel } from "../routers/crudRouter";
import { parseQueryParam } from "./queryParms"

export function mountHandler(router, getRepo, log:(level:LogLevel,msg:any)=>void) {
    router.get('/:repo', async (req, res) => {
        try {
            const findOption = parseQueryParam(req.query)
            const repo = await getRepo(req)
            log('trace', `get repo=${repo.metadata.name}`)
            log('trace', findOption)
            const result = await repo.findAndCount(findOption)
            res.json(result)
        } catch (error) {
            log('error', error)
            throw error
        }
    })
    router.get('/:repo/:id', async (req: Request, res: Response) => {
        try {
            const repo = await getRepo(req)
            const id = req.params.id
            log('trace', `get repo=${repo}, id=${id}`)
            const item = await repo.findOne(id)
            if (!item) {
                res.sendStatus(401)
            }
            res.json(item)
        } catch (error) {
            log('error', error)
            throw error
        }
    })
    router.post("/:repo", async function (req: Request, res: Response) {
        try {
            const repo = await getRepo(req)
            log('trace', `post repo=${repo.metadata.name}`)
            const item = await repo.create(req.body);
            const results = await repo.save(item);
            return res.send(results);
        } catch (error) {
            log('trace', error)
            throw error
        }
    });

    router.put("/:repo/:id", async function (req: Request, res: Response) {
        try {
            const repo = await getRepo(req)
            const id = req.params.id
            log('trace', `put repo=${repo.metadata.name}, id=${id}`)
            const user = await repo.findOne(id);
            repo.merge(user, req.body);
            const results = await repo.save(user as any);
            return res.send(results);
        } catch (error) {
            log('error', error)
            throw error
        }
    });

    router.delete("/:repo/:id", async function (req: Request, res: Response) {
        try {
            const repo = await getRepo(req)
            const id = req.params.id
            log('trace', `delete repo=${repo.metadata.name}, id=${id}`)
            const results = await repo.delete(id);
            return res.send(results);
        } catch (error) {
            log('error', error)
            throw error
        }
    });
} 