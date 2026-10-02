export const TIPOS_PAGAMENTO = {
    CARTAO_CREDITO: 0.05,
    CARTAO_DEBITO: 0.02,
    BOLETO: 0,
    DINHEIRO: 0,
    PIX: -0.05,
  };

export function calcularValorVenda(valor, tipoPagamento) {
      const calcularValorFinal = (valor, tipoPagamento) => {
        const ajuste = TIPOS_PAGAMENTO[tipoPagamento];
        if (ajuste === undefined) {
          throw new Error(`Tipo de pagamento ${tipoPagamento} não suportado`);
        }
        return Math.round(Number(valor) * (1 + ajuste));
      }

      return calcularValorFinal(valor, tipoPagamento);
}