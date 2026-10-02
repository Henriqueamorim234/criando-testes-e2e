class Venda {
  static db;

  static TIPOS_PAGAMENTO = {
    CARTAO_CREDITO: 0.05,
    CARTAO_DEBITO: 0.02,
    BOLETO: 0,
    DINHEIRO: 0,
    PIX: -0.05,
  };

  static configurarDB(db) {
    this.db = db;
  }

  constructor({
    id,
    livro_id,
    id_livro,
    idLivro,
    valor,
    tipo_pagamento,
    modoPagamento,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.livro_id = livro_id ?? id_livro ?? idLivro;
    this.valor = valor;
    this.tipo_pagamento = tipo_pagamento ?? modoPagamento;
    this.created_at = created_at || new Date().toISOString();
    this.updated_at = updated_at || new Date().toISOString();
  }

  static calcularValorFinal(valor, tipoPagamento) {
    const ajuste = Venda.TIPOS_PAGAMENTO[tipoPagamento];
    if (ajuste === undefined) {
      return valor;
    }
    return Math.round(Number(valor) * (1 + ajuste));
  }

  static async pegarVendas() {
    return this.db.select('*').from('vendas');
  }

  static async pegarPeloId(id) {
    const resultado = await this.db.select('*').from('vendas').where({ id });
    return resultado[0];
  }

  async criar() {
    const dados = {
      livro_id: this.livro_id,
      valor: this.valor,
      tipo_pagamento: this.tipo_pagamento,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
    const resultado = await Venda.db('vendas').insert(dados, '*');
    return resultado[0];
  }

  async atualizar(id) {
    await Venda.db('vendas')
      .where({ id })
      .update({ ...this, updated_at: new Date().toISOString() });

    return Venda.db.select('*').from('vendas').where({ id });
  }

  static async excluir(id) {
    await this.db('vendas').where({ id }).del();
  }

  async salvar() {
    if (this.id) {
      const resultado = await this.atualizar(this.id);
      return resultado;
    }
    const resultado = await this.criar();
    return resultado;
  }

  async enviarEmail(editora) {
    if (!editora?.email) {
      return;
    }

    const assunto = 'Nova venda registrada';
    const mensagem = `Foi registrada uma venda do livro ${this.livro_id} no valor de ${this.valor}.`;
    console.log(`Email enviado para ${editora.email}: ${assunto} - ${mensagem}`);
    return { enviado: true, destinatario: editora.email, assunto, mensagem };
  }

  static paraResposta(venda) {
    return {
      id: venda.id,
      id_livro: venda.livro_id,
      modoPagamento: venda.tipo_pagamento,
      valor: venda.valor,
      created_at: venda.created_at,
      updated_at: venda.updated_at,
    };
  }
}

export default Venda;
