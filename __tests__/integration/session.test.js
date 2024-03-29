const request = require('supertest')

const app = require('../../src/app')
const truncate = require('../utils/truncate')
const factory = require('../factories')

describe('Authentication', ()=> {
    beforeEach(async ()=> {
        await truncate()
    })

    it('should be authenticate with valid credentials', async ()=> {
        const user = await factory.create('User', {
            password: 'patrick123'
        })

        const response = await request(app).post('/sessions').send({email: user.email, password: 'patrick123'})

        expect(response.status).toBe(200)
    })

    it('should be not authenticate with invalid credentials', async () => {
        const user = await factory.create('User', {
            password: 'patrick123'
        })

        const response = await request(app).post('/sessions').send({email: user.email, password: 'patrick'})

        expect(response.status).toBe(401)
    })

    it('should be return jwt token when authenticated', async () =>{
        const user = await factory.create('User', {
            password: 'patrick123'
        })

        const response = await request(app).post('/sessions').send({email: user.email, password: 'patrick123'})

        expect(response.body).toHaveProperty('token')
    })

    it('should be able to access private routes with authenticated', async ()=> {
        const user = await factory.create('User', {
            password: 'patrick123'
        })

        const response = await request(app).get('/dashboard').set('Authorization', `Bearer ${user.generateToken()}`)

        expect(response.status).toBe(200)
    })

    it('should not be able to access private routes without jwt token', async ()=> {
        const user = await factory.create('User', {
            password: 'patrick123'
        })

        const response = await request(app).get('/dashboard')

        expect(response.status).toBe(401)
    })

    it('should not be able aceess private routes with invalid jwt token', async ()=> {

        const response = await request(app).get('/dashboard').set('Authorization', `Bearer 123456pat123456`)

        expect(response.status).toBe(401)

    })
})

