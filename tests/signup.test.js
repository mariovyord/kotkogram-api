const mongoose = require('mongoose');
const supertest = require("supertest");
const app = require("../src/app");
const { testConnectionString } = require('./test.constants');

const url = '/api/users/signup';


describe("Test /api/users/signup", () => {
    beforeAll(async () => {
        await mongoose.connect(testConnectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    });

    afterAll((done) => {
        mongoose.connection.dropDatabase()
            .then(() => {
                mongoose.connection.close(done);
            })
    });

    test("/signup returns 4xx code and errors if body is empty", async () => {
        const test = await supertest(app)
            .post(url)
            .expect(400);

        expect(test.body.message).toBe('Signup failed');
        expect(test.body.errors).not.toHaveLength(0);
    });

    test('successful signup with valid user data', async () => {
        const test = await supertest(app)
            .post(url)
            .set('Content-Type', 'application/json')
            .send({ username: `john1`, firstName: 'John', lastName: 'Johnson', password: '123123' })
            .expect(200);

        expect(test.body.message).toBe('Signup successful');
        expect(test.body).toHaveProperty('data');
        expect(test.body).not.toHaveProperty('errors');
    })

    test('signup with invalid password fails', async () => {
        const test = await supertest(app)
            .post(url)
            .set('Content-Type', 'application/json')
            .send({ username: `john`, firstName: 'John', lastName: 'Johnson', password: '123%  123' })
            .expect(400);

        expect(test.body.message).toBe('Signup failed');
        expect(test.body).not.toHaveProperty('data');
        expect(test.body.errors).not.toHaveLength(0);
    })

    test('signup with invalid username fails', async () => {
        const test = await supertest(app)
            .post(url)
            .set('Content-Type', 'application/json')
            .send({ username: 'john asda s a', firstName: 'John', lastName: 'Johnson', password: '123123' })
            .expect(400);

        expect(test.body.message).toBe('Signup failed');
        expect(test.body).not.toHaveProperty('data');
        expect(test.body.errors).not.toHaveLength(0);
    })

    test('signup with existing username fails', async () => {
        await supertest(app)
            .post(url)
            .set('Content-Type', 'application/json')
            .send({ username: 'bob', firstName: 'John', lastName: 'Johnson', password: '123123' })

        const test = await supertest(app)
            .post(url)
            .set('Content-Type', 'application/json')
            .send({ username: 'bob', firstName: 'John', lastName: 'Johnson', password: '123123' })
            .expect(400);

        expect(test.body.message).toBe('Signup failed');
        expect(test.body).not.toHaveProperty('data');
        expect(test.body.errors).not.toHaveLength(0);
    })
})