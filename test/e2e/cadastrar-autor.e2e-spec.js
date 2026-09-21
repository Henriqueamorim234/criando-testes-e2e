import {describe, test, after } from 'node:test'
import request from 'supertest'
import app from '#src/app.js'
import conexao from '#db/singleton-connection.js'
import assert from 'node:assert'

describe('Cadastrar Autor', () => {
    after(async() => {
       await conexao.destroy();
    })

    test('Retorna o autor cadastrato quando os dados são validos (201)', async ()=>{
        // enviar request para (POST) /autores
        const response = await request(app).post('/autores').send({
            "nome": "H.P. Lovecraft Novo",
            "nacionalidade": "Ingles"
          }).expect(201)
          .expect((res)=>{
            const dadosResposta = res.body.content;
            assert.strictEqual(typeof dadosResposta.id, 'number');
            assert.strictEqual(dadosResposta.nome, 'H.P. Lovecraft Novo');
            assert.strictEqual(dadosResposta.nacionalidade, 'Ingles');
          })
          .then((response)=> response.body.content);
          const autorNoBanco = await conexao('autores').where('id', response.id).first();

          assert.ok(autorNoBanco)
          assert.strictEqual(autorNoBanco.nome, response.nome);
          assert.strictEqual(autorNoBanco.nacionalidade, response.nacionalidade);
        // verificar se o status code é 201
        // verificar se o body da resposta contém os dados do autor cadastrato
    })

    test('Retorna um erro quando os dados são invalidos (400)', async ()=>{
        // enviar request para (POST) /autores
        await request(app).post('/autores').send({
            "nome": "",
            "nacionalidade": ""
          }).expect(400)
          .expect((res)=>{
            const codigoDeErro = res.body.type
            assert.strictEqual(codigoDeErro, 'INVALID_DATA');
          })
          // resistencia a refatoracao
    })
})