import { LivrosServices } from "#src/services/livros.services.js";
import test, { after, beforeEach, describe } from "node:test";
import conexao from "#db/singleton-connection.js";
import  assert  from "node:assert";
import { criarLivro } from "#test/factories/livro.factories.js";

describe('LivrosServices', ()=>{
    const sut = new LivrosServices(conexao);

    after(async ()=>{
        await conexao.destroy();
    })

    beforeEach(async ()=>{
        await conexao('livros').delete()
    })
    
    describe('listarLivros', ()=>{
        test('retorna todos os livros cadastrados', async ()=> {
            // arrange
            const livro1 = await criarLivro({titulo: 'LIVRO TESTE'});
            const livro2 = await criarLivro({titulo: 'LIVRO TESTE 2'});
            
            // act
            const resultado = await sut.listarLivros();

            // assert
            assert.deepStrictEqual(resultado, [livro1, livro2]);
        })
        test('retorna uma lista vazia quando não há livros cadastrados', async ()=> {
            const resultado = await sut.listarLivros();
            assert.deepStrictEqual(resultado, []);
        })
    })
    
    describe('buscarLivroPorId', ()=>{
        test('retorna undefined quando o livro não existe', async ()=>{
            // arrange
            const id = 999;
            // act
            const resultado = await sut.buscarLivroPorId(id);
            // assert
            assert.strictEqual(resultado, undefined);
        })
        test('retorna o livro quando o livro existe', async ()=>{
            // arrange
            const livro = await criarLivro({titulo: 'LIVRO TESTE'});
            // act
            const resultado = await sut.buscarLivroPorId(livro.id);
            // assert
            assert.deepStrictEqual(resultado, livro);
        })
    })

})