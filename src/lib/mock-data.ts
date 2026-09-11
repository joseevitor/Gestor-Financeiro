import { Divida, Gasto, Rendimento } from "./types";

export const mockDividas: Divida[] = [
  {
    id: "d1",
    credor: "Cartão Nubank",
    descricao: "Fatura parcelada em atraso",
    valorTotal: 3200,
    dataCriacao: "2026-04-10",
    vencimento: "2026-09-15",
    taxaJurosMensal: 8.5,
    categoria: "Cartão de crédito",
    pagamentos: [
      { id: "p1", dividaId: "d1", valor: 800, data: "2026-07-05", formaPagamento: "pix" },
      { id: "p2", dividaId: "d1", valor: 600, data: "2026-08-05", formaPagamento: "pix" },
    ],
  },
  {
    id: "d2",
    credor: "Banco Inter — Empréstimo pessoal",
    descricao: "Empréstimo para quitar outras dívidas",
    valorTotal: 6500,
    dataCriacao: "2026-02-20",
    vencimento: "2027-02-20",
    taxaJurosMensal: 3.2,
    categoria: "Empréstimo",
    pagamentos: [
      { id: "p3", dividaId: "d2", valor: 6500, data: "2026-08-20", formaPagamento: "transferencia" },
    ],
  },
  {
    id: "d3",
    credor: "Enel — Conta de luz",
    descricao: "Conta em aberto há 2 meses",
    valorTotal: 410,
    dataCriacao: "2026-07-01",
    vencimento: "2026-08-10",
    categoria: "Utilidades",
    pagamentos: [],
  },
  {
    id: "d4",
    credor: "Faculdade — Mensalidade",
    descricao: "Parcelamento da rematrícula",
    valorTotal: 1800,
    dataCriacao: "2026-01-15",
    vencimento: "2026-10-15",
    categoria: "Educação",
    pagamentos: [
      { id: "p4", dividaId: "d4", valor: 450, data: "2026-06-15", formaPagamento: "boleto" },
    ],
  },
];

export const mockRendimentos: Rendimento[] = [
  { id: "r1", fonte: "Salário CLT", valor: 4200, data: "2026-09-01", recorrente: true, categoria: "salario" },
  { id: "r2", fonte: "Projeto freelance — landing page", valor: 950, data: "2026-08-22", recorrente: false, categoria: "freelance" },
  { id: "r3", fonte: "Dividendos", valor: 78.4, data: "2026-08-15", recorrente: false, categoria: "investimento" },
];

export const mockGastos: Gasto[] = [
  { id: "g1", descricao: "Aluguel", valor: 1450, data: "2026-09-05", categoria: "moradia", formaPagamento: "transferencia", fixo: true },
  { id: "g2", descricao: "Supermercado", valor: 620, data: "2026-09-03", categoria: "alimentacao", formaPagamento: "cartao_debito", fixo: false },
  { id: "g3", descricao: "Uber / transporte", valor: 180, data: "2026-09-06", categoria: "transporte", formaPagamento: "pix", fixo: false },
  { id: "g4", descricao: "Academia", valor: 99.9, data: "2026-09-01", categoria: "saude", formaPagamento: "cartao_credito", fixo: true },
  { id: "g5", descricao: "Streaming (Netflix + Spotify)", valor: 54.8, data: "2026-09-02", categoria: "lazer", formaPagamento: "cartao_credito", fixo: true },
];
