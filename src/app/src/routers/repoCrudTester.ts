import express from "express";
import axios from "axios"
import { User } from "entities/user";
import { Group } from "entities/group";
import { Post } from "entities/post";

const testRouter = express.Router()
function getUrl(url: string) {
    const fullUrl = 'http://localhost:3000/api/repos/' + url
    return fullUrl
}

async function getToken(userName: string, password: string) {
    const result = await axios.post('http://localhost:3000/api/token', { userName, password })
    return result.data
}

async function getConfig(userName: string, password: string = '1234') {
    const token = await getToken(userName, password)
    return {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
}
testRouter.get('/init/', async (req, res) => {
    const config = await getConfig('admin', '1234')
    for (let i = 1; i < 3; i++) {
        const item: Partial<Group> = {
            name: 'group' + i
        }
        await axios.post(getUrl('group'), item, config)
    }
    for (let i = 2; i < 6; i++) {
        const item: Partial<User> = {
            userName: 'user' + i,
            password: '1234',
            firstName: 'Joe' + i,
            lastName: 'Doe' + i,
            role: 'common',
            groupId: i % 2 + 1
        }
        await axios.post(getUrl('user'), item, config)
    }
    res.send('ok')
})

testRouter.get('/read/:user/:repo/', async (req, res) => {
    const repo = req.params.repo
    const config = await getConfig(req.params.user)
    try {
        const result = await axios.get(getUrl(repo), config)
        res.send(result.data)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

testRouter.get('/create/:user/:repo/:groupId/:userId/:id', async (req, res) => {
    const { id, groupId, userId, user, repo } = req.params
    const userEntity: Partial<User> = {
        userName: 'user' + id,
        password: '1234',
        firstName: 'Joe ' + id,
        lastName: 'Doe ' + id,
        role: 'common',
        groupId: +groupId
    }
    const groupEntity: Partial<Group> = {
        name: 'group' + id
    }

    const poseEntity: Partial<Post> = {
        subject: 'subject-' + user + '-' + id,
        content: 'content' + id,
        userId: + userId,
        groupId: + groupId
    }
    const item = repo === 'user' ? userEntity
        : repo === 'group' ? groupEntity
            : repo === 'post' ? poseEntity
                : ''

    const config = await getConfig(user)
    const result = await axios.post(getUrl(repo), item, config)
    res.send(result.data)
})

testRouter.get('/delete/:user/:repo/:id', async (req, res) => {
    try {

        const { id, user, repo } = req.params
        const config = await getConfig(user)
        const result = await axios.delete(getUrl(repo + '/' + id), config)
        res.send('ok')
    } catch (error) {
        res.status(500).send(error)
    }
})

testRouter.get('/update/:user/:repo/:id/:field/:val', async (req, res) => {
    const { id, user, repo, val, field } = req.params
    const config = await getConfig(user)
    const item = {
        id: +id,
    }
    item[field] = val
    const result = await axios.put(getUrl(repo + '/' + id), item, config)
    res.send('ok')
})
export { testRouter }