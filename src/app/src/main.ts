import express from "express";
import { crudLog, mylog } from "./utilities/mylogger";
import { ormConfig } from "./config/ormconfig";
//import { createCRUDRouter } from "./routers/crudRouter";
import {createCRUDRouter } from "typeorm-json-api"
import { testRouter } from "./routers/repoCrudTester";
import jwt from 'jsonwebtoken'
import { Request, Response } from "express";
const app = express()
app.use(express.json())
app.get('/api/token', getToken)
app.use('/api/repos', createCRUDRouter(ormConfig, crudLog))
app.use('/test/repos', testRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
})


const secret = 'very secret'
function getToken(req: Request, res: Response) {
    const token = jwt.sign({ username: 'joe@a.com' }, secret, { expiresIn: '1800s' })
    res.send(token)
}
function verifyToken(req, res, next) {
    console.log('in verify token')
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
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