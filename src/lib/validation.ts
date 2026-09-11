import { z } from "zod";

export const formaPagamentoEnum = z.enum([
  "pix",
  "boleto",
  "cartao_credito",
  "cartao_debito",
  "dinheiro",
  "transferencia",
]);

export const categoriaGastoEnum = z.enum([
  "moradia",
  "alimentacao",
  "transporte",
  "saude",
  "lazer",
  "educacao",
  "outros",
]);

export const categoriaRendimentoEnum = z.enum([
  "salario",
  "freelance",
  "investimento",
  "outros",
]);

export const dividaSchema = z.object({
  credor: z.string().trim().min(1, "Informe o credor"),
  descricao: z.string().trim().optional().default(""),
  valorTotal: z.coerce.number().positive("O valor total deve ser maior que zero"),
  dataCriacao: z.string().min(1, "Informe a data"),
  vencimento: z.string().min(1, "Informe o vencimento"),
  taxaJurosMensal: z.coerce.number().min(0).optional(),
  categoria: z.string().trim().min(1, "Informe a categoria"),
});

export const pagamentoSchema = z.object({
  valor: z.coerce.number().positive("O valor do pagamento deve ser maior que zero"),
  data: z.string().min(1, "Informe a data"),
  formaPagamento: formaPagamentoEnum,
  observacao: z.string().trim().optional(),
});

export const gastoSchema = z.object({
  descricao: z.string().trim().min(1, "Informe a descrição"),
  valor: z.coerce.number().positive("O valor deve ser maior que zero"),
  data: z.string().min(1, "Informe a data"),
  categoria: categoriaGastoEnum,
  formaPagamento: formaPagamentoEnum,
  fixo: z.coerce.boolean().optional().default(false),
});

export const rendimentoSchema = z.object({
  fonte: z.string().trim().min(1, "Informe a fonte"),
  descricao: z.string().trim().optional(),
  valor: z.coerce.number().positive("O valor deve ser maior que zero"),
  data: z.string().min(1, "Informe a data"),
  recorrente: z.coerce.boolean().optional().default(false),
  categoria: categoriaRendimentoEnum,
});
