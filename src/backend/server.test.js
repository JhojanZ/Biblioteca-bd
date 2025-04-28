const request = require('supertest');
const app = require('./server'); // Adjust the path as necessary

describe('Server Tests', () => {
    test('should respond with 200 status', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
    });
    
    test('should return JSON', async () => {
        const response = await request(app).get('/');
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });
});