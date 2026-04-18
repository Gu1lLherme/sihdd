import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Lógica central replicada aqui (functions são deploy-independentes e não podem importar do frontend).
 * ⚠️ Qualquer alteração aqui DEVE ser espelhada em lib/itcmd/calcularPartilhaCore.js e vice-versa.
 */
const DESCENDENTES = ['filho', 'filha', 'neto', 'neta'];

function partilharBem({ valorBem, regimeBens, dataAquisicao, dataCasamento, origemBem, temFilhos, qtdFilhos, conjugeParticipa }) {
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
      tipoPartilha = 'comum'; meacao = valorBem * 0.5; herancaFilhos = valorBem * 0.5; break;
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
      herancaFilhos = valorBem; break;
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

function classificarHerdeiro(h) {
  const renunciou = h.renuncia_tipo && h.renuncia_tipo !== 'nenhuma';
  const cedeuOnerosa = h.cessao_tipo === 'onerosa';
  const cedeuNaoOnerosa = h.cessao_tipo === 'nao_onerosa';
  return {
    renunciou, cedeuOnerosa, cedeuNaoOnerosa,
    participaPartilha: !renunciou && !cedeuNaoOnerosa,
    eSujeitoPassivo: !renunciou && !cedeuOnerosa && !cedeuNaoOnerosa,
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { caso_id } = await req.json();
    if (!caso_id) return Response.json({ error: 'caso_id é obrigatório' }, { status: 400 });

    const [caso] = await base44.entities.Caso.filter({ id: caso_id });
    if (!caso) return Response.json({ error: 'Caso não encontrado' }, { status: 404 });

    const { regime_bens, data_casamento, conjuge_e_ascendente_herdeiros, data_obito } = caso;
    if (!data_obito) {
      return Response.json({ error: 'Data do óbito é obrigatória para determinar a legislação do ITCMD aplicável.' }, { status: 400 });
    }

    const [bens, herdeirosRaw, dividasRaw] = await Promise.all([
      base44.entities.Bem.filter({ caso_id }),
      base44.entities.Herdeiro.filter({ caso_id }),
      base44.entities.Divida.filter({ caso_id }),
    ]);

    // CTN art. 38 / Súmula 590 STF — base líquida
    const dividasExigiveis = (dividasRaw || []).filter(d => {
      const status = d.status || (d.pago ? 'paga' : 'pendente');
      return status === 'pendente';
    });
    const totalDividas = dividasExigiveis.reduce((s, d) => s + (Number(d.valor) || 0), 0);
    const valorPatrimonioBruto = bens.reduce((s, b) => s + (Number(b.valor) || 0), 0);
    const fatorLiquido = valorPatrimonioBruto > 0
      ? Math.max(0, (valorPatrimonioBruto - totalDividas) / valorPatrimonioBruto)
      : 1;

    // Classificação de herdeiros (Regra 11.01)
    const herdeiros = herdeirosRaw.map(h => ({ ...h, ...Object.fromEntries(Object.entries(classificarHerdeiro(h)).map(([k, v]) => [`_${k}`, v])) }));
    const filhosParticipantes = herdeiros.filter(h => DESCENDENTES.includes(h.parentesco) && h._participaPartilha);
    const qtdFilhos = filhosParticipantes.length;
    const temFilhos = qtdFilhos > 0;
    const conjugeHerdeiro = herdeiros.find(h => h.parentesco === 'conjuge' && h._participaPartilha);
    const todosFilhosSaoDoConjuge = filhosParticipantes.every(f => f.e_filho_conjuge !== false);

    // Partilha por bem
    let totalMeacaoConjuge = 0, totalHerancaConjuge = 0, totalHerancaFilhos = 0;
    const bensCalculados = bens.map(bem => {
      const valorLiquido = (bem.valor || 0) * fatorLiquido;
      const r = partilharBem({
        valorBem: valorLiquido, regimeBens,
        dataAquisicao: bem.data_aquisicao, dataCasamento: data_casamento, origemBem: bem.origem_bem,
        temFilhos, qtdFilhos, conjugeParticipa: !!conjugeHerdeiro,
      });
      totalMeacaoConjuge += r.meacao;
      totalHerancaConjuge += r.herancaConjuge;
      totalHerancaFilhos += r.herancaFilhos;
      return { ...bem, tipo_bem_partilha: r.tipoPartilha, valor_meacao_conjuge: r.meacao, valor_heranca_conjuge: r.herancaConjuge, valor_heranca_filhos: r.herancaFilhos };
    });

    // Regra dos 25%
    const totalHeranca = totalHerancaConjuge + totalHerancaFilhos;
    const minimoConjuge25 = totalHeranca * 0.25;
    let regra25Aplicada = false;
    if (['comunhao_parcial', 'separacao_total'].includes(regime_bens) && conjuge_e_ascendente_herdeiros && todosFilhosSaoDoConjuge && temFilhos && conjugeHerdeiro && totalHerancaConjuge < minimoConjuge25) {
      totalHerancaConjuge = minimoConjuge25;
      totalHerancaFilhos = totalHeranca - totalHerancaConjuge;
      regra25Aplicada = true;
    }
    const valorPorFilho = temFilhos ? totalHerancaFilhos / qtdFilhos : 0;

    // Legislação vigente na DATA DO ÓBITO
    const dataObito = new Date(data_obito);
    const anoObito = dataObito.getFullYear();
    const ufps = await base44.entities.HistoricoUFP.filter({ ano: anoObito });
    const valorUFP = ufps[0]?.valor;
    if (!valorUFP) {
      return Response.json({ error: `Valor da UFP não cadastrado para o ano ${anoObito} (ano do óbito). Cadastre em Legislação antes de calcular o ITCMD.`, codigo: 'UFP_NAO_CADASTRADA', ano: anoObito }, { status: 422 });
    }

    const regras = await base44.entities.RegraITCMD.filter({ tipo_transmissao: 'causa_mortis' });
    const regraAplicavel = regras.find(r => {
      const inicio = new Date(r.data_inicio_vigencia);
      const fim = r.data_fim_vigencia ? new Date(r.data_fim_vigencia) : new Date('2100-01-01');
      return dataObito >= inicio && dataObito <= fim;
    });
    if (!regraAplicavel || !regraAplicavel.faixas?.length) {
      return Response.json({ error: `Nenhuma regra de ITCMD (causa mortis) cadastrada para a data do óbito (${dataObito.toLocaleDateString('pt-BR')}). Cadastre a legislação vigente em Legislação antes de calcular.`, codigo: 'REGRA_ITCMD_NAO_CADASTRADA', data_obito }, { status: 422 });
    }

    const calcularITCMD = (valor) => {
      if (!valor || valor <= 0) return 0;
      const valorEmUFP = valor / valorUFP;
      const faixa = regraAplicavel.faixas.find(f => {
        const min = f.min_ufp || 0;
        const max = f.max_ufp || Infinity;
        return valorEmUFP > min && valorEmUFP <= max;
      });
      return valor * ((faixa?.aliquota || 0) / 100);
    };

    // Quinhões e ITCMD por herdeiro
    const herdeirosCalculados = herdeiros.map(h => {
      let valorParte = 0, valorItcmd = 0, contribuinteItcmd = null;
      if (!h._participaPartilha) {
        // Excluído
      } else if (DESCENDENTES.includes(h.parentesco)) {
        valorParte = valorPorFilho;
      } else if (h.parentesco === 'conjuge') {
        valorParte = totalHerancaConjuge;
      }
      if (h._cedeuOnerosa) {
        valorItcmd = calcularITCMD(valorParte);
        contribuinteItcmd = 'cessionario';
      } else if (h._eSujeitoPassivo && valorParte > 0) {
        valorItcmd = calcularITCMD(valorParte);
        contribuinteItcmd = 'self';
      }
      const percentualPartilha = totalHeranca > 0 ? (valorParte / totalHeranca) * 100 : 0;
      return { ...h, valor_parte: valorParte, valor_itcmd: valorItcmd, percentual_partilha: percentualPartilha, _contribuinte_itcmd: contribuinteItcmd };
    });

    const itcmdTotal = herdeirosCalculados.reduce((s, h) => s + (h.valor_itcmd || 0), 0);
    const baseTributavel = totalHerancaConjuge + totalHerancaFilhos;
    const aliquotaEfetiva = baseTributavel > 0 ? Number(((itcmdTotal / baseTributavel) * 100).toFixed(4)) : 0;

    // Persistir
    await Promise.all(bensCalculados.map(b =>
      base44.asServiceRole.entities.Bem.update(b.id, {
        tipo_bem_partilha: b.tipo_bem_partilha,
        valor_meacao_conjuge: b.valor_meacao_conjuge,
        valor_heranca_conjuge: b.valor_heranca_conjuge,
        valor_heranca_filhos: b.valor_heranca_filhos,
      })
    ));
    await Promise.all(herdeirosCalculados.map(h =>
      base44.asServiceRole.entities.Herdeiro.update(h.id, {
        valor_parte: h.valor_parte,
        valor_itcmd: h.valor_itcmd,
        percentual_partilha: h.percentual_partilha,
      })
    ));
    await base44.asServiceRole.entities.Caso.update(caso_id, {
      valor_patrimonio: valorPatrimonioBruto,
      valor_dividas_espolio: totalDividas,
      valor_meacao_conjuge: totalMeacaoConjuge,
      valor_heranca_conjuge: totalHerancaConjuge,
      valor_heranca_filhos: totalHerancaFilhos,
      valor_itcmd: itcmdTotal,
      aliquota: aliquotaEfetiva,
    });

    return Response.json({
      sucesso: true,
      resumo: {
        regime_bens,
        valor_patrimonio: valorPatrimonioBruto,
        total_dividas: totalDividas,
        monte_mor_liquido: valorPatrimonioBruto - totalDividas,
        fator_liquido: fatorLiquido,
        meacao_conjuge: totalMeacaoConjuge,
        heranca_conjuge: totalHerancaConjuge,
        heranca_filhos: totalHerancaFilhos,
        itcmd_total: itcmdTotal,
        aliquota: aliquotaEfetiva,
        regra_25_aplicada: regra25Aplicada,
        qtd_herdeiros_participantes: qtdFilhos + (conjugeHerdeiro ? 1 : 0),
        base_legal: "CTN art. 38; Súmula 590/STF — ITCMD sobre o monte-mor líquido (após dedução de dívidas exigíveis do espólio).",
      },
      bens: bensCalculados.map(b => ({ id: b.id, descricao: b.descricao, valor: b.valor, tipo_partilha: b.tipo_bem_partilha, meacao_conjuge: b.valor_meacao_conjuge, heranca_conjuge: b.valor_heranca_conjuge, heranca_filhos: b.valor_heranca_filhos })),
      herdeiros: herdeirosCalculados.map(h => ({
        id: h.id, nome: h.nome, parentesco: h.parentesco,
        valor_parte: h.valor_parte, percentual: h.percentual_partilha, itcmd: h.valor_itcmd,
        renunciou: h._renunciou, cedeu_onerosa: h._cedeuOnerosa, cedeu_nao_onerosa: h._cedeuNaoOnerosa,
        contribuinte_itcmd: h._contribuinte_itcmd,
        cessionario_nome: h._cedeuOnerosa ? (h.cessionario_nome || null) : null,
        cessionario_cpf: h._cedeuOnerosa ? (h.cessionario_cpf || null) : null,
      })),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});