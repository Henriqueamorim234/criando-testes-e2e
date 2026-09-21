import {describe, test, after } from 'node:test'
import request from 'supertest'
import app from '#src/app.js'
import conexao from '#db/singleton-connection.js'
import assert from 'node:assert'

describe('Buscar Autor por ID', () => {
    after(async() => {
       await conexao.destroy();
    })

    test('Retornar os dados do autor existente (201)', async ()=>{
        // cadastrar um autor
        const respostaDoCadastro = await request(app).post('/autores').send({
          "nome": "H.P. Lovecraft",
          "nacionalidade": "Ingles"
        }).expect(201)
        const idDoAutor = respostaDoCadastro.body.content.id;
        // enviar request para (GET) /autores/:id
        // verificar se o status code é 201
        // verificar se o body da resposta contém os dados do autor cadastrato
        await request(app).get(`/autores/${idDoAutor}`).expect(200).expect((res)=>{
          const dadosDoAutor = res.body;
          assert.strictEqual(typeof dadosDoAutor.id, 'number');
          assert.strictEqual(dadosDoAutor.nome, 'H.P. Lovecraft');
          assert.strictEqual(dadosDoAutor.nacionalidade, 'Ingles');
        })
    })

    test('Retornar os dados do autor existente (201) (usando banco de dados)', async ()=>{
      // cadastrar um autor
      const resultado = await conexao('autores').insert({
        nome: 'H.P. Lovecraft',
        nacionalidade: 'Ingles'
      }, 'id')
      const idDoAutor = resultado[0].id;
      // enviar request para (GET) /autores/:id
      // verificar se o status code é 201
      // verificar se o body da resposta contém os dados do autor cadastrato
      await request(app).get(`/autores/${idDoAutor}`).expect(200).expect((res)=>{
        const dadosDoAutor = res.body;
        assert.strictEqual(typeof dadosDoAutor.id, 'number');
        assert.strictEqual(dadosDoAutor.nome, 'H.P. Lovecraft');
        assert.strictEqual(dadosDoAutor.nacionalidade, 'Ingles');
      })
  })

    test('Retorna um erro quando o autor não exista (404)', async ()=>{
        // enviar request para (GET) /autores/:999
        await request(app).get('/autores/999')
        .expect(404).expect((res)=>{
          const codigoDeErro = res.body.type
          assert.strictEqual(codigoDeErro, 'NOT_FOUND'); 
        })
    })
})