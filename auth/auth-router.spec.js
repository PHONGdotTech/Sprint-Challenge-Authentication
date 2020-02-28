const request = require('supertest')
const server = require('../api/server')

const db = require('../database/dbConfig')

describe('auth router', () => {
    describe('POST /api/auth/register', () => {
        it('should return 201 created', async () => {
            await request(server).post('/api/auth/register')
                .send({username: randomizeName(), password: "password"})
                .then(async res =>{
                    expect(res.status).toBe(201)
                })
        })

        it('should return object containing message, id, username', async () =>{
            await request(server).post('/api/auth/register')
                .send({username: randomizeName(), password: "password"})
                .then(async res =>{
                    expect(res.body).toEqual(expect.objectContaining({
                        message: "Successfully created user.",
                        id: expect.any(Number),
                        username: expect.any(String)
                    }))
                })
        })
    })

    describe('POST to /api/auth/register then POST to /api/auth/login', () => {
        it('should return status 200 ok', async () => {
            const name = await randomizeName()
            await request(server).post('/api/auth/register')
                .send({username: name, password: "password"})
                .then(async res =>{
                    await request(server).post('/api/auth/login')
                    .send({username: name, password: "password"})
                    .then(async res2 =>{
                        expect(res2.status).toBe(200)
                    })
                })
        })

        it('should return welcome-back message and a token', async () => {
            const name = await randomizeName()
            await request(server).post('/api/auth/register')
                .send({username: name, password: "password"})
                .then(async res =>{
                    await request(server).post('/api/auth/login')
                    .send({username: name, password: "password"})
                    .then(async res2 =>{
                        expect(res2.body).toEqual(expect.objectContaining({
                            message: `Welcome back, ${name}!`,
                            token: expect.any(String)
                        }))
                    })
                })
        })

        it('truncates db after testing', async () => {
            await db('users').truncate();
        })
    })
})

function randomizeName(){
    const randomNum = Math.floor(Math.random() * Math.floor(99999999));
    const randomNum2 = Math.floor(Math.random() * Math.floor(99999999));
    const randomNumString = randomNum.toString();
    const randomNumString2 = randomNum2.toString();
    const name = `john${randomNumString}doe${randomNumString2}`

    return name;
}