import conexao from '#db/singleton-connection.js';
import VendasServices from '#services/vendas.services.js';
import { criarLivro } from '#test/factories/livro.factories.js';
import assert from 'node:assert';
import test, { after, describe, mock } from 'node:test';
import { assertMock } from '#test/utils/mock.assertions.js';
import { criarEditora } from '#test/factories/editora.factories.js';

describe('Vendas Services', () => {
  after(async () => {
    await conexao.destroy();
  });

  describe('registrarVenda', () => {
    test('resgistra uma venda com sucesso e envia um email', async () => {
      // Arrange
      const emailGatewayMock = {
        enviarEmail: mock.fn(), // mock
      };

      const estoqueGatewayMock = {
        temEstoque: mock.fn(() => Promise.resolve(true)), // stub
      };

      const sut = new VendasServices(conexao, emailGatewayMock, estoqueGatewayMock);
      const editora = await criarEditora({
        email: 'editora@teste.com',
      });
      const livro = await criarLivro({
        titulo: 'Teste',
        editora_id: editora.id,
      });

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
      assertMock(emailGatewayMock.enviarEmail).wasCalledWith({
        remetente: 'vendas@livraria.com',
        destinatario: 'editora@teste.com',
        assunto: `nova venda registrada`,
        mensagem: `Venda registrada com sucesso para o livro Teste`,
      });
    });

    test('retorna um erro se o livro não tiver estoque', async () => {
      // Arrange
      const emailGatewayMock = {
        enviarEmail: mock.fn(), // mock
      };

      const estoqueGatewayMock = {
        temEstoque: mock.fn(() => Promise.resolve(false)), // stub
      };

      const sut = new VendasServices(conexao, emailGatewayMock, estoqueGatewayMock);
      const livro = await criarLivro({
        titulo: 'Teste',
      });

      // Act
      const resposta = () =>
        sut.registrarVenda({
          idLivro: livro.id,
          modoPagamento: 'PIX',
          valor: 100,
        });

      // Assert
      assert.rejects(resposta, { message: 'Livro sem estoque' });
    });
  });
});
