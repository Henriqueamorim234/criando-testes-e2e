import { describe, test } from 'node:test'
import Autor from '#src/models/autor.js'
import assert from 'node:assert'

describe('Autor', () => {
    describe('constructor', () => {
        test.todo('cria uma instacia de autor com todos os campos', ()=>{
            // arrange 
            const dadosAutor = {
                id: 1,
                nome: 'João da Silva',
                nacionalidade: 'Brasileiro',
                created_at: '2026-01-01T00:00:00.000Z',
                updated_at: '2026-01-01T00:00:00.000Z',
            }
           // act
            const autor = new Autor(dadosAutor);
            // assert
            assert.strictEqual(autor.id, dadosAutor.id);
            assert.strictEqual(autor.nome, dadosAutor.nome);
            assert.strictEqual(autor.nacionalidade, dadosAutor.nacionalidade);
            assert.strictEqual(autor.created_at, dadosAutor.created_at);
            assert.strictEqual(autor.updated_at, dadosAutor.updated_at);
        })
        test('cria uma instacia de autor com campos opcionais faltando', ()=>{
            // arrange
            const dadosAutor = {
                id: 1,
                nome: 'João da Silva',
                nacionalidade: 'Brasileiro',
            }
            // act
            const autor = new Autor(dadosAutor);
            // assert
            assert.strictEqual(autor.id, dadosAutor.id);
            assert.strictEqual(autor.nome, dadosAutor.nome);
            assert.strictEqual(autor.nacionalidade, dadosAutor.nacionalidade);
            assert.ok(typeof autor.created_at === 'string'); // verifica se o created_at é definido e é uma string
            assert.ok(typeof autor.updated_at === 'string'); // verifica se o updated_at é definido e é uma string

        })
    })

    describe('pegarAutores', ()=>{
        test('retorna uma lista de autores', async ()=>{
            // arrange
            const autoresEsperados = [
                {
                    id: 1,
                    nome: 'João da Silva',
                    nacionalidade: 'Brasileiro',
                    created_at: '2026-01-01T00:00:00.000Z',
                    updated_at: '2026-01-01T00:00:00.000Z',
                },
            ]

            const mockDb = {
                select: () => {
                    return {
                        from: () =>  Promise.resolve(autoresEsperados),
                    }
                }
            }

            Autor.configurarDB(mockDb);

            // act
            const autores = await Autor.pegarAutores();
            // assert
            assert.deepStrictEqual(autores, autoresEsperados);
        })
    })
});