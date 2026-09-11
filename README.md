# Régua — controle de dívidas e gastos

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Como os dados são guardados agora

Os dados ficam em arquivos JSON na pasta `data/` (criada automaticamente na
primeira vez que você salva algo): `data/dividas.json`, `data/gastos.json`,
`data/rendimentos.json`. Essa pasta está no `.gitignore` — são seus dados
financeiros pessoais, não vão para o Git nem para nenhum deploy.

**Importante:** enquanto o app usar esse armazenamento em arquivo, ele só
funciona rodando localmente (`npm run dev` ou em um servidor Node persistente).
Plataformas serverless como a Vercel não mantêm arquivos escritos em disco
entre requisições — quando chegar a hora de colocar isso no ar de verdade,
essa é a hora de migrar para o Supabase (já está no roadmap abaixo).

Para começar do zero de novo, é só apagar a pasta `data/`.

## Usando o app

- Vá em **Dívidas → Nova dívida** para cadastrar cada dívida (credor, valor
  total, vencimento, categoria).
- Em cada dívida, use **Registrar pagamento** sempre que pagar algo — o status
  (Não paga / Parcial / Paga) e a porcentagem são recalculados sozinhos.
- **Gastos** e **Rendimentos** têm o mesmo esquema: botão "Novo..." abre um
  formulário, e cada linha tem um ícone de lixeira para excluir.
- A **Visão geral** consolida tudo automaticamente — nada para configurar.

## Estrutura

```
src/
  app/
    page.tsx                    → Visão geral (dashboard, server component)
    dividas/page.tsx             → Dívidas (server component + DividasClient)
    rendimentos/page.tsx         → Rendimentos
    gastos/page.tsx              → Gastos + detalhamento por categoria
    categorias/page.tsx          → placeholder
    metas/page.tsx                → placeholder
    layout.tsx                    → layout raiz (sidebar + fontes)
    globals.css                   → tokens de design (cores, fontes)
    api/
      dividas/route.ts                    → GET (listar) / POST (criar)
      dividas/[id]/route.ts               → DELETE
      dividas/[id]/pagamentos/route.ts    → POST (registrar pagamento)
      gastos/route.ts, gastos/[id]/route.ts
      rendimentos/route.ts, rendimentos/[id]/route.ts
  components/
    layout/sidebar.tsx      → navegação entre abas
    status-badge.tsx         → badge de status da dívida
    progress-bar.tsx         → barra de progresso de pagamento
    page-header.tsx           → cabeçalho padrão de página
    ui/modal.tsx, ui/field.tsx → modal e campo de formulário reutilizáveis
    dividas/                 → client component + formulários (nova dívida, pagamento)
    gastos/                  → client component + formulário (novo gasto)
    rendimentos/             → client component + formulário (novo rendimento)
  lib/
    types.ts     → tipos + regras de negócio (status derivado)
    store.ts     → persistência em arquivo JSON (data/*.json)
    validation.ts → schemas Zod usados nas rotas de API
    mock-data.ts → dados de exemplo (não usados mais nas páginas, ficou de referência)
    utils.ts     → cn(), formatCurrency, formatDate, formatPercent
```

## A regra central: status de dívida

O status de uma dívida **nunca é armazenado diretamente** — ele é sempre
calculado a partir dos pagamentos registrados (`src/lib/types.ts`):

```ts
percentual = totalPago / valorTotal * 100

percentual <= 0      → "nao_paga"
0 < percentual < 100 → "parcial"  (mostra o % pago)
percentual >= 100    → "paga"
```

Isso evita que o status fique "dessincronizado" do valor pago — quando o
backend existir, basta inserir um registro em `pagamentos_divida` e o status
se ajusta sozinho.

## O que falta (próximas etapas)

- [ ] Banco de dados (Supabase / Postgres) + schema Drizzle
- [ ] Auth (Supabase Auth)
- [ ] Formulários reais (criar/editar dívida, registrar pagamento, gasto, rendimento) com Zod
- [ ] Trocar mock-data por dados reais via Route Handlers
- [ ] Gráficos no dashboard (Recharts)
- [ ] Categorias e Metas com CRUD de verdade
- [ ] Testes (Vitest + Playwright)
- [ ] Docker + CI/CD

## Paleta e tipografia (referência de design)

- **Paper** `#EEF0EA` / **Ink** `#1E2422` / **Accent** `#2E4B6B`
- Status: não paga `#B3432B` · parcial `#B7791F` · paga `#2F6B48`
- Display: **Fraunces** (itálico, títulos) · Texto: **IBM Plex Sans** · Números: **IBM Plex Mono**
