import { test,  describe } from "node:test";
import { calcularValorVenda } from "#domain/calcula-valor-venda.js";
import assert from "node:assert";

describe('calcularValorVenda', () => {
    const casosDeTeste = [
        {
            valor: 100,
            tipoPagamento: 'CARTAO_CREDITO',
            valorFinal: 105
        },
        {
            valor: 100,
            tipoPagamento: 'CARTAO_DEBITO',
            valorFinal: 102
        },
        {
            valor: 100,
            tipoPagamento: 'BOLETO',
            valorFinal: 100
        },
        {
            valor: 100,
            tipoPagamento: 'DINHEIRO',
            valorFinal: 100
        },
        {
            valor: 100,
            tipoPagamento: 'PIX',
            valorFinal: 95
        },
    ]

    casosDeTeste.forEach(({valor, tipoPagamento, valorFinal}) => {
        test(`quando o valor é ${valor} e o tipo de pagamento é ${tipoPagamento}, o valor final deve ser ${valorFinal}`, ()=>{
            const valorCalculado = calcularValorVenda(valor, tipoPagamento);
            assert.strictEqual(valorCalculado, valorFinal);
        })
    })

    test('retorna um erro para modo de pagamento invalido', ()=>{
        //  a
        const valor = 100;
        const tipoPagamento = 'INVALIDO';
        
        const callbackErro = () => calcularValorVenda(valor, tipoPagamento);   
        assert.throws(callbackErro, {
            message: `Tipo de pagamento ${tipoPagamento} não suportado`
        });
    })
})