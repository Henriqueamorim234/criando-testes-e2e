import { describe, test, after, beforeEach } from 'node:test';
import request from 'supertest';
import { createTestApp } from '#test/utils/create-test-app.js';
import conexao from '#db/singleton-connection.js';

describe('Listar autores', () => {
  const app = createTestApp();

  after(async () => {
    await conexao.destroy();
  });

  beforeEach(async () => {
    await conexao('autores').delete();
  });

  test('Retorna a lista de autores quando tem pelo menos um cadastrado (200)', async () => {
    const hpLovecraft = await request(app)
      .post('/autores')
      .send({
        nome: 'H.P. Lovecraft',
        nacionalidade: 'Ingles',
      })
      .expect(201)
      .then((res) => {
        return res.body.content;
      });
    const isaacAsimov = await request(app)
      .post('/autores')
      .send({
        nome: 'Isaac Asimov',
        nacionalidade: 'Americano',
      })
      .expect(201)
      .then((res) => {
        return res.body.content;
      });

    await request(app).get('/autores').expect(200).expect([hpLovecraft, isaacAsimov]);
  });

  test('retorna uma lista vazia quando não tem autores (200)', async () => {
    await request(app).get('/autores').expect(200).expect([]);
  });
});
