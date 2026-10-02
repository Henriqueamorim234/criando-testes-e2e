import {describe, test, after } from 'node:test'
import request from 'supertest'
import app from '#src/app.js'
import conexao from '#db/singleton-connection.js'
import assert from 'node:assert'

describe('registrar venda', () => {
    after(async() => {
       await conexao.destroy();
    })

    test('Registrar uma venda', async ()=>{
         // arrange
         const livro = await criarLivro({titulo: 'livro teste'})

         // act 
         const response = await request(app).post('/vendas').send({
          "id_livro": livro.id,
          'modoPagamento': 'BOLETO',
          'valor': 100,
         }).expect(200).then((res)=> res.body.content);

         // assert
         assert.strictEqual(response.id_livro, livro.id);
         assert.strictEqual(response.modoPagamento, 'BOLETO');
         assert.strictEqual(response.valor, 100);
    })
}) 

async function criarLivro(dadosParciais = {}){
  const [ autor ] = await conexao('autores').insert({
    'nome': 'Autor Teste',
    'nacionalidade': 'Brasileira',
  }).returning('*');

  const [ editora ] = await conexao('editoras').insert({
    'nome': 'Editora Teste',
    'cidade': 'São Paulo',
    'email': 'editora@teste.com',
  }).returning('*');

  const dadosLivro = {
    'titulo': 'Livro Teste',
    'paginas': 100,
    'autor_id': autor.id,
    'editora_id': editora.id,
    ...dadosParciais,
  }

  const [ livro ] = await conexao('livros').insert(dadosLivro).returning('*');
  return livro;
}