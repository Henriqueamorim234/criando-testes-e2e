import Venda from "#models/venda.js";
import  { calcularValorVenda }  from "#domain/calcula-valor-venda.js";

export default class VendasServices {
    constructor(dataBaseConections){
        Venda.configurarDB(dataBaseConections);
    }

    async registrarVenda({idLivro, modoPagamento, valor}){

        const valorFinal = calcularValorVenda(valor, modoPagamento);
        const venda = new Venda({
          livro_id: idLivro,
          valor: valorFinal,
          tipo_pagamento: modoPagamento,
        });
        
        const resposta = await venda.salvar();
        return resposta;
    }
}