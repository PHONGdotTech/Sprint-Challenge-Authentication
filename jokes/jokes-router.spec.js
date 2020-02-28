const request = require('supertest')
const server = require('../api/server')

const db = require('../database/dbConfig')

describe('jokes router', () => {
    describe('GET /api/jokes', () =>{
        it('should return status 400 if no authorization set in headers', async () => {
            await request(server).get('/api/jokes')
            .then(res =>{
                expect(res.status).toBe(400)
            })
        })

        it('should return status 401 if authorization failed', async () => {
            await request(server).get('/api/jokes')
            .set('Authorization', `${Math.random()}`)
            .then(res =>{
                expect(res.status).toBe(401)
            })
        })

        it('should return status 200 if authorized', async () => {
            const name = await randomizeName()
            await request(server).post('/api/auth/register')
                .send({username: name, password: "password"})
                .then(async res =>{
                    await request(server).post('/api/auth/login')
                    .send({username: name, password: "password"})
                    .then(async res2 =>{
                        await request(server).get('/api/jokes')
                        .set('Authorization', res2.body.token)
                        .then(async res3 => {
                            expect(res3.status).toBe(200)
                        })
                    })
                })
        })

        it('should return array if authorized', async () => {
            const name = await randomizeName()
            await request(server).post('/api/auth/register')
                .send({username: name, password: "password"})
                .then(async res =>{
                    await request(server).post('/api/auth/login')
                    .send({username: name, password: "password"})
                    .then(async res2 =>{
                        await request(server).get('/api/jokes')
                        .set('Authorization', res2.body.token)
                        .then(async res3 => {
                            expect(Array.isArray(res3.body)).toBe(true)
                        })
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