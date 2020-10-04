import express from "express";
import { Request, Response, Express } from "express";
import { Connection, createConnection, getConnection } from "typeorm";
import axios from "axios"
import { User } from "entities/user";

const testRouter = express.Router()
function getUrl(url: string) {
    const fullUrl = 'http://localhost:3000/api/repos/' + url
    return fullUrl
}

async function getToken() {
    const result = await axios.get('http://localhost:3000/api/token')
    console.log(result.data)
    return result.data
}

async function getConfig() {
    const token = await getToken()
    return {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
}

testRouter.get('/get/', async (req, res) => {
    const config = await getConfig()
    const result = await axios.get(getUrl('user'),  config )
    res.send(result.data)
})

testRouter.get('/add/:id', async (req, res) => {
    const id = req.params.id
    const user: Partial<User> = {
        firstName: 'Joe ' + id,
        lastName: 'Doe ' + id
    }
    const config = await getConfig()
    const result = await axios.post(getUrl('user'), user, config )
    res.send('ok')
})

testRouter.get('/del/:id', async (req, res) => {
    const id = req.params.id
    const config = await getConfig()
    const result = await axios.delete(getUrl('user/' + id), config)
    res.send('ok')
})

testRouter.get('/put/:id', async (req, res) => {
    const id = +req.params.id
    const config = await getConfig()
    const user: Partial<User> = {
        id,
        firstName: 'Joe new' + id,
        lastName: 'Doe new' + id
    }
    const result = await axios.put(getUrl('user/' + id), user, config)
    res.send('ok')
})
export { testRouter }