import Venda from '#models/venda.js';
import Livro from '#models/livro.js';
import Editora from '#models/editora.js';
import  VendasServices  from '#services/vendas.services.js';
import { EmailGateway } from '#src/gateways/emailGateway.js';

export class VendasController {
  constructor(databaseConnection) {
    Venda.configurarDB(databaseConnection);
    Livro.configurarDB(databaseConnection);
    Editora.configurarDB(databaseConnection);
    this.vendasServices = new VendasServices(databaseConnection);
    this.emailGateway = new EmailGateway();
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

      const resposta = await this.vendasServices.registrarVenda({idLivro, modoPagamento, valor});
      const editora = await Editora.pegarPeloId(livro.editora_id);

      const venda = new Venda(resposta);
      await this.emailGateway.enviarEmail({
        remetente: 'vendas@livraria.com',
        destinatario: editora.email,
        assunto: `a venda ${venda.id} foi registrada com sucesso`,
        mensagem: `Venda registrada com sucesso para o livro ${livro.titulo}`,
      })
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
