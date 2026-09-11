export type StatusDivida = "nao_paga" | "parcial" | "paga";

export type CategoriaGasto =
  | "moradia"
  | "alimentacao"
  | "transporte"
  | "saude"
  | "lazer"
  | "educacao"
  | "outros";

export type FormaPagamento =
  | "pix"
  | "boleto"
  | "cartao_credito"
  | "cartao_debito"
  | "dinheiro"
  | "transferencia";

export interface PagamentoDivida {
  id: string;
  dividaId: string;
  valor: number;
  data: string; // ISO date
  formaPagamento: FormaPagamento;
  observacao?: string;
}

export interface Divida {
  id: string;
  credor: string;
  descricao: string;
  valorTotal: number;
  dataCriacao: string; // ISO date
  vencimento: string; // ISO date
  taxaJurosMensal?: number; // percentual
  categoria: string;
  pagamentos: PagamentoDivida[];
}

export interface Rendimento {
  id: string;
  fonte: string;
  descricao?: string;
  valor: number;
  data: string; // ISO date
  recorrente: boolean;
  categoria: "salario" | "freelance" | "investimento" | "outros";
}

export interface Gasto {
  id: string;
  descricao: string;
  valor: number;
  data: string; // ISO date
  categoria: CategoriaGasto;
  formaPagamento: FormaPagamento;
  fixo: boolean;
}

/** Calcula o total já pago de uma dívida somando os pagamentos registrados. */
export function totalPago(divida: Divida): number {
  return divida.pagamentos.reduce((acc, p) => acc + p.valor, 0);
}

/** Percentual pago em relação ao valor total (0–100+). */
export function percentualPago(divida: Divida): number {
  if (divida.valorTotal <= 0) return 0;
  return (totalPago(divida) / divida.valorTotal) * 100;
}

/** Status derivado da dívida a partir dos pagamentos — nunca armazenado diretamente. */
export function statusDivida(divida: Divida): StatusDivida {
  const pct = percentualPago(divida);
  if (pct <= 0) return "nao_paga";
  if (pct >= 100) return "paga";
  return "parcial";
}

export function saldoDevedor(divida: Divida): number {
  return Math.max(divida.valorTotal - totalPago(divida), 0);
}
