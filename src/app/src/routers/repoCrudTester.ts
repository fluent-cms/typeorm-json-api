import express from "express";
import { Request, Response, Express } from "express";
import { Connection, createConnection } from "typeorm";
import axios from "axios"
import { User } from "entities/user";

const testRouter = express.Router()
function getUrl (url:string) {
    const fullUrl = 'http://localhost:3000/api/repos/' + url
    console.log(fullUrl)
    return fullUrl
}

testRouter.get('/add/:id', async (req, res) => {
    const id = req.params.id
    const user :Partial<User> = {
        firstName :'Joe ' + id,
        lastName:'Doe ' + id
    }

    const result = await axios.post(getUrl('user'), user)
    res.send('ok')
})

testRouter.get('/del/:id', async (req, res) => {
    const id = req.params.id
    const result = await axios.delete(getUrl('user/' + id))
    res.send('ok')
})

testRouter.get('/put/:id', async (req, res) => {
    const id = +req.params.id
    const user :Partial<User> = {
        id,
        firstName :'Joe new' + id,
        lastName:'Doe new' + id
    } 
    const result = await axios.put(getUrl('user/' + id),user)
    res.send('ok')
})
export { testRouter }