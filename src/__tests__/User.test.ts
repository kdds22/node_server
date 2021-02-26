import request from 'supertest';
import { app } from '../app';
import createConnection from '../database';


describe("Users", () => {
    beforeAll(async () => {
        const conn = await createConnection();
        await conn.runMigrations();
    });

    it("Should be able to create users", async () => {
        const response = await request(app).post("/users")
            .send({
                name: "User Exemple",
                email: "user@email.com"
            });

        expect(response.status).toBe(201);
    });

    it("Should not be able to create users", async () => {
        const response = await request(app).post("/users")
            .send({
                name: "User Exemple",
                email: "user@email.com"
            });

        expect(response.status).toBe(400);
    });
});