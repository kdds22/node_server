import request from 'supertest';
import { app } from '../app';
import createConnection from '../database';


describe("Surveys", () => {
    beforeAll(async () => {
        const conn = await createConnection();
        await conn.runMigrations();
    });

    it("Should be able to create surveys", async () => {
        const response = await request(app).post("/surveys")
            .send({
                title: "Survey Exemple",
                description: "Survey Description Test"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    it("Should not be able to create survey", async () => {
        const response = await request(app).post("/surveys")
            .send({
                title: "Survey Exemple",
                description: "Survey Description Test"
            });

        expect(response.status).toBe(400);
    });

    it("Should be able to see all surveys", async () => {
        await request(app).post("/surveys")
            .send({
                title: "Survey Exemple 2",
                description: "Survey Description 2 Test"
            });

        const response = await request(app).get("/surveys");

        expect(response.body.length).toBe(2);
    });
});