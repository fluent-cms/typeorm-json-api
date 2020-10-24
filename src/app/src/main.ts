import express from "express";
import { ormConfig } from "./config/ormconfig";
import { createCRUDRouter } from 'typeorm-json-api';
import { testRouter } from "./routers/repoCrudTester";
import jwt from 'jsonwebtoken'
import { Request, Response } from "express";
import { ConnectionOptions, createConnection, Equal, getRepository } from "typeorm";
import { User } from "./entities/user";

async function bootStrap() {
    await createConnection(ormConfig as ConnectionOptions)
    await seed()
    const app = express()
    app.use(express.json())
    app.post('/api/token', getToken)
    app.use('/api/repos', createCRUDRouter(ormConfig, undefined, verifyToken))
    app.use('/test', testRouter)

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running in http://localhost:${PORT}`)
    })
}
bootStrap()


const secret = 'very secret'
async function getToken(req: Request, res: Response) {
    console.log('-------------in get token-------------')
    const user = await getRepository(User).findOne(req.body)
    delete user.password
    const token = jwt.sign({...user,userId:user.id}, secret, { expiresIn: '1800s' })
    console.log(token)
    console.log('------------end get token------')
    res.send(token)
}

function verifyToken(req, res, next) {
    console.log('-------in verify token----------')
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        console.log('-----401')
        return res.sendStatus(401)
    }
    jwt.verify(token, secret, (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403)
        }
        req.user = user
        next() // pass the execution off to whatever request the client intended
    })
}

async function seed() {
    const repo = await getRepository(User)
    const admin = await repo.findOne({ where: { userName: Equal('admin') } })
    if (!admin) {
        const user: Partial<User> = {
            userName: 'admin',
            password: '1234',
            firstName: 'admin',
            lastName: 'admin',
            role: 'admin'
        }
        const item = repo.create(user)
        await repo.save(item)
        console.log('user added')
    }
}