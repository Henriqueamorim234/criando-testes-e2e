import {describe, test, after, beforeEach } from 'node:test'
import request from 'supertest'
import app from '#src/app.js'
import conexao from '#db/singleton-connection.js'
import { criarLivro } from '#test/factories/livro.factories.js'
import assert from 'node:assert'

describe('Listar livros', () => {
    after(async() => {
       await conexao.destroy();
    })

    beforeEach(async() => {
      await conexao('livros').delete();
    })

    test('Retorna a lista de livros quando tem pelo menos um cadastrado (200)', async ()=>{
      // arrange
      const livroBanco = await criarLivro({titulo: 'livro teste'})
      const livro2Banco = await criarLivro({titulo: 'livro teste 2'})

      // act
      await request(app).get('/livros').expect(200).expect((res)=> {
        assert.strictEqual(res.body.length, 2);
        const livro = res.body[0]
        const livro2 = res.body[1]  
        assert.strictEqual(livro.titulo, livroBanco.titulo);
        assert.strictEqual(livro2.titulo, livro2Banco.titulo);
      })
    })

    test('retorna uma lista vazia quando não tem livros (200)', async ()=>{
      await request(app).get('/livros').expect(200).expect([])
    })
})