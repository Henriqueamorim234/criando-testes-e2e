import Venda from '#models/venda.js';
import Livro from '#models/livro.js';
import Editora from '#models/editora.js';
import { calcularValorVenda } from '#domain/calcula-valor-venda.js';
import { EstoqueApiGateway } from '#src/gateways/estoque-api.gateway.js';

export default class VendasServices {
  constructor(
    dataBaseConections,
    emailGateway = new this.emailGateway(),
    estoqueGateway = new EstoqueApiGateway(),
  ) {
    Venda.configurarDB(dataBaseConections);
    Livro.configurarDB(dataBaseConections);
    Editora.configurarDB(dataBaseConections);
    this.emailGateway = emailGateway;
    this.estoqueGateway = estoqueGateway;
  }

  async registrarVenda({ idLivro, modoPagamento, valor }) {
    const temEstoque = await this.estoqueGateway.temEstoque(idLivro);
    if (!temEstoque) {
      throw new Error('Livro sem estoque');
    }
    const valorFinal = calcularValorVenda(valor, modoPagamento);
    const venda = new Venda({
      livro_id: idLivro,
      valor: valorFinal,
      tipo_pagamento: modoPagamento,
    });

    const resposta = await venda.salvar();
    const livro = await Livro.pegarPeloId(idLivro);
    const editora = await Editora.pegarPeloId(livro.editora_id);

    await this.emailGateway.enviarEmail({
      remetente: 'vendas@livraria.com',
      destinatario: editora.email,
      assunto: 'nova venda registrada',
      mensagem: `Venda registrada com sucesso para o livro ${livro.titulo}`,
    });

    return resposta;
  }
}
