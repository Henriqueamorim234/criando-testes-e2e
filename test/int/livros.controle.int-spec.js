import test, { after, describe, mock} from 'node:test';
import {LivrosController} from '#src/controllers/livros.controller.js';
import conexao from "#db/singleton-connection.js";
import { criarLivro } from '#test/factories/livro.factories.js';
import { assertMock } from '#test/utils/mock.assertions.js';

describe('LivrosControle', ()=>{
    const sut = new LivrosController(conexao);

    describe('pegarLivros',  ()=>{
        test('retorna todos os livros cadastrados', async ()=>{
            // arrange 
            const livro = await criarLivro({titulo: 'LIVRO TESTE'});
            
            const req = {}
            const resSpy = {
                status: mock.fn(()=> resSpy),
                json: mock.fn(()=> resSpy),
                send: mock.fn(()=> resSpy),
            }

            // act 
            await sut.listarLivros(req, resSpy);

            // assert
            assertMock(resSpy.status).wasCalledWith(200);
            assertMock(resSpy.send).wasCalledWith([livro]);
        })
    })  
    describe('pegarLivroPorId', ()=>{})
    describe('cadastrarLivro ', ()=>{})
    
    after(async ()=>{
        await conexao.destroy();
    })
})  