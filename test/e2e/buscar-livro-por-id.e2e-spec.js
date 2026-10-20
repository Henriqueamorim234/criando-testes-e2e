import {describe, test, after } from 'node:test'
import request from 'supertest'
import app from '#src/app.js'
import conexao from '#db/singleton-connection.js'
import assert from 'node:assert'
import { criarLivro } from '#test/factories/livro.factories.js'

describe('Buscar livro por ID', () => {
    after(async() => {
       await conexao.destroy();
    })

    test('Retornar os dados do livro existente (200)', async ()=>{
      // criar um livro
      const livro = await criarLivro();
      // enviar request para (GET) /livros/:id
      // verificar se o status code é 200
      // verificar se o body da resposta contém os dados do livro cadastrato
      await request(app).get(`/livros/${livro.id}`).expect(200).expect((res)=>{
        const dadosDoLivro = res.body;
        assert.strictEqual(dadosDoLivro.id, livro.id);
        assert.strictEqual(dadosDoLivro.titulo, livro.titulo);
        assert.strictEqual(dadosDoLivro.paginas, livro.paginas);
      })
    })

    test('Retorna um erro quando o livro não exista (404)', async ()=>{
        // enviar request para (GET) /livro/:999
        await request(app).get('/livros/999')
        .expect(404).expect((res)=>{
          const codigoDeErro = res.body.type
          assert.strictEqual(codigoDeErro, 'NOT_FOUND'); 
        })
    })
})  