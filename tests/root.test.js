const supertest = require("supertest");
const app = require("../src/app");

describe("Test the root path", () => {
    test("/api returns welcome message and endpoints", async () => {
        const test = await supertest(app)
            .get('/api')
            .expect(200);

        expect(test.body.message).toBe('Hello to Kotkogram REST API');
        expect(test.body.endpoints).toHaveLength(2);
    });

    test("Wrong url returns 404 and a message", async () => {
        const test = await supertest(app)
            .get('/asdasdc1')
            .expect(404);

        expect(test.body.message).toBe('Path not found');
    });

    test("/ returns 404 and a message", async () => {
        const test = await supertest(app)
            .get('/')
            .expect(404);

        expect(test.body.message).toBe('Path should start with /api');
    });
})