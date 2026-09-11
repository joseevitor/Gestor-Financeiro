import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Divida, Gasto, Rendimento, PagamentoDivida } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readCollection<T>(file: string): Promise<T[]> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, file);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T[];
  } catch (err: unknown) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      await fs.writeFile(filePath, "[]\n", "utf-8");
      return [];
    }
    throw err;
  }
}

async function writeCollection<T>(file: string, data: T[]): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, file);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

// ---------- Dívidas ----------

export async function getDividas(): Promise<Divida[]> {
  return readCollection<Divida>("dividas.json");
}

export async function createDivida(
  input: Omit<Divida, "id" | "pagamentos">
): Promise<Divida> {
  const dividas = await getDividas();
  const nova: Divida = { ...input, id: randomUUID(), pagamentos: [] };
  dividas.push(nova);
  await writeCollection("dividas.json", dividas);
  return nova;
}

export async function deleteDivida(id: string): Promise<void> {
  const dividas = await getDividas();
  await writeCollection(
    "dividas.json",
    dividas.filter((d) => d.id !== id)
  );
}

export async function addPagamento(
  dividaId: string,
  pagamento: Omit<PagamentoDivida, "id" | "dividaId">
): Promise<Divida | null> {
  const dividas = await getDividas();
  const divida = dividas.find((d) => d.id === dividaId);
  if (!divida) return null;
  divida.pagamentos.push({ ...pagamento, id: randomUUID(), dividaId });
  await writeCollection("dividas.json", dividas);
  return divida;
}

// ---------- Gastos ----------

export async function getGastos(): Promise<Gasto[]> {
  return readCollection<Gasto>("gastos.json");
}

export async function createGasto(input: Omit<Gasto, "id">): Promise<Gasto> {
  const gastos = await getGastos();
  const novo: Gasto = { ...input, id: randomUUID() };
  gastos.push(novo);
  await writeCollection("gastos.json", gastos);
  return novo;
}

export async function deleteGasto(id: string): Promise<void> {
  const gastos = await getGastos();
  await writeCollection(
    "gastos.json",
    gastos.filter((g) => g.id !== id)
  );
}

// ---------- Rendimentos ----------

export async function getRendimentos(): Promise<Rendimento[]> {
  return readCollection<Rendimento>("rendimentos.json");
}

export async function createRendimento(
  input: Omit<Rendimento, "id">
): Promise<Rendimento> {
  const rendimentos = await getRendimentos();
  const novo: Rendimento = { ...input, id: randomUUID() };
  rendimentos.push(novo);
  await writeCollection("rendimentos.json", rendimentos);
  return novo;
}

export async function deleteRendimento(id: string): Promise<void> {
  const rendimentos = await getRendimentos();
  await writeCollection(
    "rendimentos.json",
    rendimentos.filter((r) => r.id !== id)
  );
}
