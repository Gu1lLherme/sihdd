import { base44 } from "@/api/base44Client";

/**
 * Garante um numero_caso único no formato PROC-{timestamp}[-n].
 * Base44 não suporta unique constraint no schema, então a verificação
 * é feita em tempo de criação.
 */
export async function gerarNumeroCasoUnico(prefix = "PROC") {
  const tentarGerar = async (n = 0) => {
    const base = `${prefix}-${Date.now()}`;
    const candidato = n === 0 ? base : `${base}-${n}`;
    const existentes = await base44.entities.Caso.filter({ numero_caso: candidato });
    if (existentes.length === 0) return candidato;
    return tentarGerar(n + 1);
  };
  return tentarGerar();
}