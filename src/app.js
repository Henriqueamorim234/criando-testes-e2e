import express from 'express';
import { routes } from './routes/index.js';

export default function criarAplicacao(dependencias) {
  const app = express();
  app.use(express.json());

  routes(app, dependencias);

  return app;
}
