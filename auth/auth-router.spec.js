const request = require('supertest')
const server = require('../api/server')

const db = require('../database/dbConfig')

describe('auth router', () => {
    describe('POST /api/auth/register', () => {
        

        it('should return 201 created', async () => {
            return request(server).post('/api/auth/register')
                .send({username: randomizeName(), password: "password"})
                .then(async res =>{
                    await db('users').where({id: res.body.id}).delete();
                    expect(res.status).toBe(201)
                })
        })

        it('should return object containing message, id, username', async () =>{
            await request(server).post('/api/auth/register')
                .send({username: randomizeName(), password: "password"})
                .then(async res =>{
                    await db('users').where({id: res.body.id}).delete();
                    expect(res.body).toEqual(expect.objectContaining({
                        message: "Successfully created user.",
                        id: expect.any(Number),
                        username: expect.any(String)
                    }))
                })
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