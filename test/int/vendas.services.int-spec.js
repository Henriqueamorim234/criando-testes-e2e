import conexao from '#db/singleton-connection.js';
import VendasServices from '#services/vendas.services.js';
import { criarLivro } from '#test/factories/livro.factories.js';
import assert from 'node:assert';
import test, { after, describe } from 'node:test';

describe('Vendas Services', () => {
  after(async () => {
    await conexao.destroy();
  });

  describe('registrarVenda', () => {
    test('resgistra uma venda com sucesso e envia um email', async () => {
      // Arrange
      const sut = new VendasServices(conexao);
      const livro = await criarLivro();

      // Act
      const resposta = await sut.registrarVenda({
        idLivro: livro.id,
        modoPagamento: 'PIX',
        valor: 100,
      });

      // Assert
      assert.strictEqual(resposta.livro_id, livro.id);
      assert.strictEqual(resposta.valor, 95);
      assert.strictEqual(resposta.tipo_pagamento, 'PIX');
    });
  });
});
