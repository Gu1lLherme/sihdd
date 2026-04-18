/**
 * Lógica central de cálculo da partilha de herança e ITCMD.
 *
 * ⚠️ FONTE ÚNICA DE VERDADE — usada por:
 *   - functions/calcularPartilhaHeranca.js (server)
 *   - hooks/useCalcularPartilha.js (preview no frontend)
 *
 * Regras aplicadas:
 *   - CTN art. 38 / Súmula 590 STF — base = monte-mor líquido (após dívidas exigíveis)
 *   - Art. 1.829, I, CC/02 — regras de meação/concorrência por regime de bens
 *   - Regra dos 25% — cônjuge concorrente com seus próprios descendentes
 *   - Cessão/Renúncia (Regra 11.01) — impacto na partilha e no sujeito passivo
 *
 * NÃO DEPENDE DE I/O. Recebe tudo pronto e retorna objeto puro.
 */

const PARENTESCOS_DESCENDENTES = ['filho', 'filha', 'neto', 'neta'];

/** Faz a partilha de UM bem conforme regime de bens. Retorna {meacao, herancaConjuge, herancaFilhos, tipoPartilha}. */
export function partilharBem({ valorBem, regimeBens, dataAquisicao, dataCasamento, origemBem, temFilhos, qtdFilhos, conjugeParticipa }) {
  const aquis = dataAquisicao ? new Date(dataAquisicao) : null;
  const casam = dataCasamento ? new Date(dataCasamento) : null;
  let meacao = 0, herancaConjuge = 0, herancaFilhos = 0, tipoPartilha = 'particular';

  switch (regimeBens) {
    case 'comunhao_parcial':
    case 'uniao_estavel':
      if (aquis && casam && aquis > casam && (origemBem || 'onerosa') === 'onerosa') {
        tipoPartilha = 'comum';
        meacao = valorBem * 0.5;
        herancaFilhos = valorBem * 0.5;
      } else if (temFilhos) {
        herancaConjuge = conjugeParticipa ? valorBem / (qtdFilhos + 1) : 0;
        herancaFilhos = valorBem - herancaConjuge;
      } else {
        herancaConjuge = conjugeParticipa ? valorBem : 0;
      }
      break;

    case 'comunhao_universal':
      tipoPartilha = 'comum';
      meacao = valorBem * 0.5;
      herancaFilhos = valorBem * 0.5;
      break;

    case 'separacao_total':
    case 'participacao_final':
      if (temFilhos) {
        herancaConjuge = conjugeParticipa ? valorBem / (qtdFilhos + 1) : 0;
        herancaFilhos = valorBem - herancaConjuge;
      } else {
        herancaConjuge = conjugeParticipa ? valorBem : 0;
      }
      break;

    case 'separacao_obrigatoria':
      herancaFilhos = valorBem;
      break;

    default:
      if (temFilhos && conjugeParticipa) {
        herancaConjuge = valorBem / (qtdFilhos + 1);
        herancaFilhos = valorBem - herancaConjuge;
      } else if (conjugeParticipa) {
        herancaConjuge = valorBem;
      } else {
        herancaFilhos = valorBem;
      }
  }

  return { meacao, herancaConjuge, herancaFilhos, tipoPartilha };
}

/** Aplica a regra dos 25% quando cabível. Retorna {herancaConjuge, herancaFilhos, aplicada}. */
export function aplicarRegra25Percent({ regimeBens, conjugeEAscendenteHerdeiros, todosFilhosSaoDoConjuge, temFilhos, conjugeParticipa, totalHerancaConjuge, totalHerancaFilhos }) {
  const total = totalHerancaConjuge + totalHerancaFilhos;
  const minimo = total * 0.25;

  const cabeRegra = ['comunhao_parcial', 'separacao_total'].includes(regimeBens)
    && conjugeEAscendenteHerdeiros
    && todosFilhosSaoDoConjuge
    && temFilhos
    && conjugeParticipa
    && totalHerancaConjuge < minimo;

  if (cabeRegra) {
    return { herancaConjuge: minimo, herancaFilhos: total - minimo, aplicada: true };
  }
  return { herancaConjuge: totalHerancaConjuge, herancaFilhos: totalHerancaFilhos, aplicada: false };
}

/** Calcula ITCMD sobre um valor, usando a regra (faixas em UFP) e o valor da UFP. */
export function calcularItcmdSobreValor({ valor, regraAplicavel, valorUFP }) {
  if (!valor || valor <= 0 || !regraAplicavel?.faixas?.length || !valorUFP) return 0;
  const valorEmUFP = valor / valorUFP;
  const faixa = regraAplicavel.faixas.find(f => {
    const min = f.min_ufp || 0;
    const max = f.max_ufp || Infinity;
    return valorEmUFP > min && valorEmUFP <= max;
  });
  const aliquota = faixa?.aliquota || 0;
  return valor * (aliquota / 100);
}

/** Calcula exclusões tributárias (Regra 11.01) por herdeiro. */
export function classificarHerdeiro(h) {
  const renunciou = h.renuncia_tipo && h.renuncia_tipo !== 'nenhuma';
  const cedeuOnerosa = h.cessao_tipo === 'onerosa';
  const cedeuNaoOnerosa = h.cessao_tipo === 'nao_onerosa';
  return {
    renunciou,
    cedeuOnerosa,
    cedeuNaoOnerosa,
    participaPartilha: !renunciou && !cedeuNaoOnerosa,
    eSujeitoPassivo: !renunciou && !cedeuOnerosa && !cedeuNaoOnerosa,
  };
}

/** Calcula o fator redutor líquido (dívidas exigíveis ÷ patrimônio bruto). */
export function calcularFatorLiquido(patrimonioBruto, totalDividas) {
  if (patrimonioBruto <= 0) return 1;
  return Math.max(0, (patrimonioBruto - totalDividas) / patrimonioBruto);
}

export const DESCENDENTES = PARENTESCOS_DESCENDENTES;