import { after, before, beforeEach, describe, test } from 'node:test'
import Autor from '#src/models/autor.js'
import assert from 'node:assert'
import conexao from '#db/singleton-connection.js'
import { limparBanco } from '#src/commands/limpar-banco.command.js'

describe('Autor', () => {
    before( async ()=>{
        Autor.configurarDB(conexao);
    })

    beforeEach( async ()=>{
        await limparBanco();
    })

    after( async ()=>{
        await conexao.destroy();
    })

       describe('pegarAutores', ()=>{
        test('retorna uma lista de autores', async ()=>{
            // arrange
            const autoresEsperados = await conexao('autores').insert( [
                {
                    id: 1,
                    nome: 'João da Silva',
                    nacionalidade: 'Brasileiro',
                    created_at: '2026-01-01T00:00:00.000Z',
                    updated_at: '2026-01-01T00:00:00.000Z',
                },
                {
                    id: 2,
                    nome: 'Maria Oliveira',
                    nacionalidade: 'Brasileira',
                    created_at: '2026-01-01T00:00:00.000Z',
                    updated_at: '2026-01-01T00:00:00.000Z',
                },
                {
                    id: 3,
                    nome: 'Pedro Santos',
                    nacionalidade: 'Brasileiro',
                    created_at: '2026-01-01T00:00:00.000Z',
                    updated_at: '2026-01-01T00:00:00.000Z',
                },
            ]).returning('*');

            // act
            const autores = await Autor.pegarAutores();
            // assert
            assert.deepStrictEqual(autores, autoresEsperados);
        })
    })

    describe('criar', ()=>{
        test("criar um novo autor no banco", async ()=>{
            //arrange
            const autor = new Autor({
                nome: 'João da Silva',
                nacionalidade: 'Brasileiro',
            })

            const autorCriado = await autor.criar();
            //assert
            assert( typeof autorCriado.id === 'number');
            assert.deepStrictEqual(autorCriado.nome, autor.nome);
            assert.deepStrictEqual(autorCriado.nacionalidade, autor.nacionalidade);

            const autorNoBanco = await conexao('autores').where('id', autorCriado.id).first();
            assert.deepStrictEqual(autorNoBanco, autorCriado);
        })
    })
});