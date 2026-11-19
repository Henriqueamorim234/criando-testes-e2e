import Venda from '#models/venda.js';
import Livro from '#models/livro.js';

export class VendasController {
  constructor(databaseConnection, vendasServices) {
    Venda.configurarDB(databaseConnection);
    Livro.configurarDB(databaseConnection);
    this.vendasServices = vendasServices;
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

    try {
      Venda.validarTipoPagamento(modoPagamento);
    } catch {
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

      const resposta = await this.vendasServices.registrarVenda({ idLivro, modoPagamento, valor });
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
