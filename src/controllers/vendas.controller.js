import Venda from '#models/venda.js';
import Livro from '#models/livro.js';
import Editora from '#models/editora.js';

export class VendasController {
  constructor(databaseConnection) {
    Venda.configurarDB(databaseConnection);
    Livro.configurarDB(databaseConnection);
    Editora.configurarDB(databaseConnection);
  }

  async registrarVenda(req, res) {
    const { body } = req;
    const idLivro = body.id_livro ?? body.idLivro;
    const modoPagamento = body.modoPagamento;
    const valor = body.valor;

    if (!idLivro || valor === undefined || !modoPagamento) {
      return res.status(400).json({
        message: 'Dados inválidos para registro de venda',
        type: 'INVALID_DATA',
      });
    }

    if (!(modoPagamento in Venda.TIPOS_PAGAMENTO)) {
      return res.status(400).json({
        message: 'Tipo de pagamento inválido',
        type: 'INVALID_DATA',
      });
    }

    try {
      const livro = await Livro.pegarPeloId(idLivro);
      if (!livro) {
        return res.status(404).json({
          message: 'Livro não encontrado',
          type: 'NOT_FOUND',
        });
      }

      const valorFinal = Venda.calcularValorFinal(valor, modoPagamento);
      const venda = new Venda({
        livro_id: idLivro,
        valor: valorFinal,
        tipo_pagamento: modoPagamento,
      });
      const resposta = await venda.salvar();

      const editora = await Editora.pegarPeloId(livro.editora_id);
      await venda.enviarEmail(editora);

      return res.status(200).json({
        message: 'venda registrada',
        content: Venda.paraResposta(resposta),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json(err.message);
    }
  }
}
