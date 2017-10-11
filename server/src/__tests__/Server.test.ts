import {startServer} from '../server';
import * as Express from 'express'; 
import * as http from 'http';
const request = require('supertest')

describe.only("Server",  () => {
    let server: http.Server;
    beforeAll(() => {
        server = startServer(8080)
    })

    it("responds to /ScoringGuide", () => {
        return request(server).get('/ScoringGuide')
            .expect('Content-Type', /html/)
            .expect(200)
    })

    it("responds with 404", () => {
        return request(server).get('/bad_path')
            .expect('Content-Type', /html/)
            .expect(400)
    })

    afterAll(() => {
        server.close()
    })
})

