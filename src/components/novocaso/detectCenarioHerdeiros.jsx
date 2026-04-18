// Art. 1.829, I, CC/02 — Regra de Ouro da partilha.
// Classifica cada bem como COMUM ou PARTICULAR conforme o regime de bens
// e detecta o cenário (A/B/C) para fins de concorrência do cônjuge.

export function classificarBem(bem, regimeBens, dataCasamento) {
  const valor = Number(bem.valor) || 0;
  const origem = bem.origem_bem || "onerosa";
  const dataAquisicao = bem.data_aquisicao ? new Date(bem.data_aquisicao) : null;
  const dtCasamento = dataCasamento ? new Date(dataCasamento) : null;

  switch (regimeBens) {
    case "comunhao_universal":
      // Todos os bens são comuns (salvo exceções legais — não modelado aqui)
      return "comum";

    case "comunhao_parcial":
    case "uniao_estavel":
      // Bem comum = adquirido APÓS o casamento, de forma ONEROSA
      if (dataAquisicao && dtCasamento && dataAquisicao > dtCasamento && origem === "onerosa") {
        return "comum";
      }
      return "particular";

    case "participacao_final":
      // Durante o casamento: bens particulares; na dissolução, há meação sobre aquestos onerosos.
      // Para efeito de partilha por morte, tratamos os adquiridos na constância e onerosos como comuns.
      if (dataAquisicao && dtCasamento && dataAquisicao > dtCasamento && origem === "onerosa") {
        return "comum";
      }
      return "particular";

    case "separacao_total":
    case "separacao_obrigatoria":
      return "particular";

    default:
      return "particular";
  }
}

/**
 * Retorna o cenário detectado e os totais.
 *
 * Cenários (Art. 1.829, I):
 * - A: Apenas bens comuns → cônjuge só tem meação, não concorre na herança.
 * - B: Bens comuns E particulares → cônjuge tem meação sobre os comuns e concorre como herdeiro nos particulares.
 * - C: Apenas bens particulares → cônjuge concorre com os filhos em tudo (sem meação).
 * - N/A: Sem cônjuge ou sem bens.
 */
export function detectCenarioPartilha({ bens = [], regimeBens, dataCasamento, temConjuge }) {
  if (!temConjuge || bens.length === 0) {
    return { cenario: "NA", totalComum: 0, totalParticular: 0, qtdComum: 0, qtdParticular: 0 };
  }

  let totalComum = 0;
  let totalParticular = 0;
  let qtdComum = 0;
  let qtdParticular = 0;

  bens.forEach((b) => {
    const tipo = classificarBem(b, regimeBens, dataCasamento);
    const valor = Number(b.valor) || 0;
    if (tipo === "comum") {
      totalComum += valor;
      qtdComum += 1;
    } else {
      totalParticular += valor;
      qtdParticular += 1;
    }
  });

  let cenario;
  if (totalComum > 0 && totalParticular === 0) cenario = "A";
  else if (totalComum > 0 && totalParticular > 0) cenario = "B";
  else if (totalComum === 0 && totalParticular > 0) cenario = "C";
  else cenario = "NA";

  return { cenario, totalComum, totalParticular, qtdComum, qtdParticular };
}

/**
 * Resumo textual do comportamento do cônjuge para cada regime/cenário,
 * conforme a Tabela de Implementação (Item 12).
 */
export function descreverComportamentoConjuge(regimeBens, cenario) {
  const regras = {
    comunhao_parcial: {
      meacao: "Sim (nos bens comuns)",
      concorrencia: "Sim (só nos particulares)",
      baseItcmd: "Valor do quinhão nos bens particulares",
    },
    uniao_estavel: {
      meacao: "Sim (nos bens comuns)",
      concorrencia: "Sim (só nos particulares)",
      baseItcmd: "Valor do quinhão nos bens particulares",
    },
    comunhao_universal: {
      meacao: "Sim (em tudo)",
      concorrencia: "Não",
      baseItcmd: "Zero (recebe apenas meação)",
    },
    separacao_total: {
      meacao: "Não",
      concorrencia: "Sim (em tudo)",
      baseItcmd: "Valor do quinhão sobre o total",
    },
    separacao_obrigatoria: {
      meacao: "Sim (Súmula 377) — se houver esforço comum",
      concorrencia: "Não",
      baseItcmd: "Zero (recebe apenas meação se houver)",
    },
    participacao_final: {
      meacao: "Sim (nos bens comuns)",
      concorrencia: "Sim (só nos particulares)",
      baseItcmd: "Valor do quinhão nos bens particulares",
    },
  };

  const r = regras[regimeBens] || {
    meacao: "—",
    concorrencia: "—",
    baseItcmd: "—",
  };

  const cenarios = {
    A: {
      titulo: "Cenário A — Apenas bens comuns",
      descricao:
        "O cônjuge fica com seus 50% (meação). Os outros 50% são divididos apenas entre os filhos. O cônjuge não concorre na herança.",
    },
    B: {
      titulo: "Cenário B — Bens comuns E particulares",
      descricao:
        "Sobre os bens comuns: cônjuge só tem a meação (50%). Sobre os bens particulares: cônjuge concorre com os filhos em partes iguais (respeitado o mínimo de 1/4 se for ascendente comum).",
    },
    C: {
      titulo: "Cenário C — Apenas bens particulares",
      descricao:
        "Não há meação para proteger o cônjuge. Ele concorre com os filhos em partes iguais sobre o total do patrimônio.",
    },
    NA: {
      titulo: "Sem cenário aplicável",
      descricao: "Sem cônjuge sobrevivente ou sem bens cadastrados.",
    },
  };

  return { ...r, ...cenarios[cenario] };
}