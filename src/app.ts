import express from 'express';
import 'reflect-metadata';
import createConnection from './database'
import { router } from './Routes';

createConnection();

const app = express();

app.use(express.json())
app.use(router);

export { app };