import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const { caso_id } = payload;

    if (!caso_id) {
      return Response.json({ error: 'caso_id é obrigatório' }, { status: 400 });
    }

    // 1. Dados do caso
    const casos = await base44.entities.Caso.filter({ id: caso_id });
    const caso = casos[0];
    if (!caso) {
      return Response.json({ error: 'Caso não encontrado' }, { status: 404 });
    }

    const { regime_bens, data_casamento, conjuge_e_ascendente_herdeiros, data_obito } = caso;

    // 2. Bens, Herdeiros e Dívidas
    const bens = await base44.entities.Bem.filter({ caso_id });
    const herdeirosRaw = await base44.entities.Herdeiro.filter({ caso_id });
    const dividasRaw = await base44.entities.Divida.filter({ caso_id });

    // ------------------------------------------------------------
    // REGRA FISCAL — CTN art. 38 / Súmula 590 STF
    // Base de cálculo do ITCMD = monte-mor LÍQUIDO (patrimônio − dívidas exigíveis)
    // Dívidas pagas ou contestadas não são abatidas.
    // ------------------------------------------------------------
    const dividasExigiveis = (dividasRaw || []).filter(d => {
      const status = d.status || (d.pago ? 'paga' : 'pendente');
      return status === 'pendente';
    });
    const totalDividas = dividasExigiveis.reduce((s, d) => s + (Number(d.valor) || 0), 0);
    const valorPatrimonioBruto = bens.reduce((s, b) => s + (Number(b.valor) || 0), 0);
    // Fator redutor proporcional aplicado a cada bem
    const fatorLiquido = valorPatrimonioBruto > 0
      ? Math.max(0, (valorPatrimonioBruto - totalDividas) / valorPatrimonioBruto)
      : 1;

    // ------------------------------------------------------------
    // REGRA 11.01 — EXCLUSÃO TRIBUTÁRIA
    // Renunciante → deixa de ser sujeito passivo; quinhão volta ao monte-mor
    // Cedente (onerosa ou não onerosa) → deixa de ser sujeito passivo
    //   - Onerosa:  o CESSIONÁRIO assume o ITCMD sobre aquele quinhão
    //   - Não onerosa: quinhão volta ao monte-mor e é redistribuído
    // ------------------------------------------------------------
    const herdeiros = herdeirosRaw.map(h => {
      const renunciou = h.renuncia_tipo && h.renuncia_tipo !== 'nenhuma';
      const cedeuOnerosa = h.cessao_tipo === 'onerosa';
      const cedeuNaoOnerosa = h.cessao_tipo === 'nao_onerosa';
      // Herdeiro efetivo na partilha: participa da divisão se NÃO renunciou e NÃO cedeu não-onerosamente
      const participaPartilha = !renunciou && !cedeuNaoOnerosa;
      // Sujeito passivo do ITCMD sobre o próprio quinhão: só quem não renunciou e não cedeu
      const eSujeitoPassivo = !renunciou && !cedeuOnerosa && !cedeuNaoOnerosa;
      return { ...h, _renunciou: renunciou, _cedeuOnerosa: cedeuOnerosa, _cedeuNaoOnerosa: cedeuNaoOnerosa, _participaPartilha: participaPartilha, _eSujeitoPassivo: eSujeitoPassivo };
    });

    // Filhos/descendentes que participam da partilha (após exclusões)
    const filhosParticipantes = herdeiros.filter(h =>
      ['filho', 'filha', 'neto', 'neta'].includes(h.parentesco) && h._participaPartilha
    );
    const qtdFilhos = filhosParticipantes.length;
    const temFilhos = qtdFilhos > 0;

    // Cônjuge participante (para controle da concorrência)
    const conjugeHerdeiro = herdeiros.find(h => h.parentesco === 'conjuge' && h._participaPartilha);

    // Regra dos 25%: todos os filhos participantes são do cônjuge
    const todosFilhosSaoDoConjuge = filhosParticipantes.every(f => f.e_filho_conjuge !== false);

    // Totais agregados
    let totalMeacaoConjuge = 0;
    let totalHerancaConjuge = 0;
    let totalHerancaFilhos = 0;

    const dataCasamento = data_casamento ? new Date(data_casamento) : null;

    // 3. Partilha por bem (usando valor LÍQUIDO após dedução proporcional de dívidas)
    const bensCalculados = bens.map(bem => {
      const valorBemBruto = bem.valor || 0;
      const valorBem = valorBemBruto * fatorLiquido; // base de cálculo líquida
      const dataAquisicao = bem.data_aquisicao ? new Date(bem.data_aquisicao) : null;
      const origemBem = bem.origem_bem || 'onerosa';

      let tipoBemPartilha = 'particular';
      let meacaoConjuge = 0;
      let herancaConjuge = 0;
      let herancaFilhos = 0;

      switch (regime_bens) {
        case 'comunhao_parcial':
        case 'uniao_estavel':
          if (dataAquisicao && dataCasamento && dataAquisicao > dataCasamento && origemBem === 'onerosa') {
            tipoBemPartilha = 'comum';
            meacaoConjuge = valorBem * 0.50;
            herancaConjuge = 0;
            herancaFilhos = valorBem * 0.50;
          } else {
            tipoBemPartilha = 'particular';
            if (temFilhos) {
              herancaConjuge = conjugeHerdeiro ? valorBem / (qtdFilhos + 1) : 0;
              herancaFilhos = valorBem - herancaConjuge;
            } else {
              herancaConjuge = conjugeHerdeiro ? valorBem : 0;
              herancaFilhos = 0;
            }
          }
          break;

        case 'comunhao_universal':
          tipoBemPartilha = 'comum';
          meacaoConjuge = valorBem * 0.50;
          herancaConjuge = 0;
          herancaFilhos = valorBem * 0.50;
          break;

        case 'separacao_total':
        case 'participacao_final':
          tipoBemPartilha = 'particular';
          if (temFilhos) {
            herancaConjuge = conjugeHerdeiro ? valorBem / (qtdFilhos + 1) : 0;
            herancaFilhos = valorBem - herancaConjuge;
          } else {
            herancaConjuge = conjugeHerdeiro ? valorBem : 0;
            herancaFilhos = 0;
          }
          break;

        case 'separacao_obrigatoria':
          tipoBemPartilha = 'particular';
          herancaFilhos = valorBem;
          break;

        default:
          tipoBemPartilha = 'particular';
          herancaConjuge = temFilhos && conjugeHerdeiro ? valorBem / (qtdFilhos + 1) : (conjugeHerdeiro ? valorBem : 0);
          herancaFilhos = valorBem - herancaConjuge;
      }

      totalMeacaoConjuge += meacaoConjuge;
      totalHerancaConjuge += herancaConjuge;
      totalHerancaFilhos += herancaFilhos;

      return {
        ...bem,
        valor_bruto: valorBemBruto,
        valor_liquido: valorBem,
        tipo_bem_partilha: tipoBemPartilha,
        valor_meacao_conjuge: meacaoConjuge,
        valor_heranca_conjuge: herancaConjuge,
        valor_heranca_filhos: herancaFilhos,
      };
    });

    // 4. Regra dos 25%
    const totalHeranca = totalHerancaConjuge + totalHerancaFilhos;
    const minimoConjuge25 = totalHeranca * 0.25;
    let regra25Aplicada = false;

    if (
      (regime_bens === 'comunhao_parcial' || regime_bens === 'separacao_total') &&
      conjuge_e_ascendente_herdeiros &&
      todosFilhosSaoDoConjuge &&
      temFilhos &&
      conjugeHerdeiro &&
      totalHerancaConjuge < minimoConjuge25
    ) {
      totalHerancaConjuge = minimoConjuge25;
      totalHerancaFilhos = totalHeranca - totalHerancaConjuge;
      regra25Aplicada = true;
    }

    // Parte de cada filho participante
    const valorPorFilho = temFilhos ? totalHerancaFilhos / qtdFilhos : 0;

    // 5. UFP + Regra ITCMD
    const anoObito = new Date(data_obito).getFullYear();
    const ufps = await base44.entities.HistoricoUFP.filter({ ano: anoObito });
    const valorUFP = ufps[0]?.valor || 100;

    const regras = await base44.entities.RegraITCMD.filter({ tipo_transmissao: 'causa_mortis' });
    const dataObito = new Date(data_obito);
    const regraAplicavel = regras.find(r => {
      const inicio = new Date(r.data_inicio_vigencia);
      const fim = r.data_fim_vigencia ? new Date(r.data_fim_vigencia) : new Date('2100-01-01');
      return dataObito >= inicio && dataObito <= fim;
    });

    const calcularITCMD = (valor) => {
      if (!regraAplicavel || !regraAplicavel.faixas) return 0;
      const valorEmUFP = valor / valorUFP;
      const faixa = regraAplicavel.faixas.find(f => {
        const min = f.min_ufp || 0;
        const max = f.max_ufp || Infinity;
        return valorEmUFP > min && valorEmUFP <= max;
      });
      const aliquota = faixa?.aliquota || 0;
      return valor * (aliquota / 100);
    };

    // 6. Quinhões por herdeiro (aplicando exclusões)
    const herdeirosCalculados = herdeiros.map(h => {
      let valorParte = 0;
      let valorItcmd = 0;
      let contribuinteItcmd = null; // 'self' | 'cessionario' | null (excluído)

      if (!h._participaPartilha) {
        // Renunciou ou cedeu não-onerosa → não recebe quinhão, não paga ITCMD
        valorParte = 0;
        valorItcmd = 0;
        contribuinteItcmd = null;
      } else if (['filho', 'filha', 'neto', 'neta'].includes(h.parentesco)) {
        valorParte = valorPorFilho;
      } else if (h.parentesco === 'conjuge') {
        valorParte = totalHerancaConjuge;
      }

      // Cessão onerosa: cedente recebe o valor (participa da partilha) mas quem paga ITCMD é o cessionário
      if (h._cedeuOnerosa) {
        valorItcmd = calcularITCMD(valorParte);
        contribuinteItcmd = 'cessionario';
      } else if (h._eSujeitoPassivo && valorParte > 0) {
        valorItcmd = calcularITCMD(valorParte);
        contribuinteItcmd = 'self';
      }

      const percentualPartilha = totalHeranca > 0 ? (valorParte / totalHeranca) * 100 : 0;

      return {
        ...h,
        valor_parte: valorParte,
        valor_itcmd: valorItcmd,
        percentual_partilha: percentualPartilha,
        _contribuinte_itcmd: contribuinteItcmd,
      };
    });

    // 7. ITCMD total (soma de todos os contribuintes: próprios herdeiros + cessionários)
    const itcmdTotalFilhos = herdeirosCalculados
      .filter(h => ['filho', 'filha', 'neto', 'neta'].includes(h.parentesco))
      .reduce((sum, h) => sum + (h.valor_itcmd || 0), 0);
    const itcmdConjuge = herdeirosCalculados
      .filter(h => h.parentesco === 'conjuge')
      .reduce((sum, h) => sum + (h.valor_itcmd || 0), 0);
    const itcmdTotal = itcmdConjuge + itcmdTotalFilhos;

    // 8. Persistir
    for (const bem of bensCalculados) {
      await base44.asServiceRole.entities.Bem.update(bem.id, {
        tipo_bem_partilha: bem.tipo_bem_partilha,
        valor_meacao_conjuge: bem.valor_meacao_conjuge,
        valor_heranca_conjuge: bem.valor_heranca_conjuge,
        valor_heranca_filhos: bem.valor_heranca_filhos,
      });
    }

    for (const h of herdeirosCalculados) {
      await base44.asServiceRole.entities.Herdeiro.update(h.id, {
        valor_parte: h.valor_parte,
        valor_itcmd: h.valor_itcmd,
        percentual_partilha: h.percentual_partilha,
      });
    }

    const valorPatrimonio = valorPatrimonioBruto;
    const monteMorLiquido = valorPatrimonioBruto - totalDividas;
    await base44.asServiceRole.entities.Caso.update(caso_id, {
      valor_patrimonio: valorPatrimonio,
      valor_dividas_espolio: totalDividas,
      valor_meacao_conjuge: totalMeacaoConjuge,
      valor_heranca_conjuge: totalHerancaConjuge,
      valor_heranca_filhos: totalHerancaFilhos,
      valor_itcmd: itcmdTotal,
      aliquota: regraAplicavel?.faixas?.[0]?.aliquota || 0,
    });

    // 9. Resposta (inclui detalhamento das exclusões e base líquida)
    return Response.json({
      sucesso: true,
      resumo: {
        regime_bens,
        valor_patrimonio: valorPatrimonio,
        total_dividas: totalDividas,
        monte_mor_liquido: monteMorLiquido,
        fator_liquido: fatorLiquido,
        meacao_conjuge: totalMeacaoConjuge,
        heranca_conjuge: totalHerancaConjuge,
        heranca_filhos: totalHerancaFilhos,
        itcmd_total: itcmdTotal,
        regra_25_aplicada: regra25Aplicada,
        qtd_herdeiros_participantes: qtdFilhos + (conjugeHerdeiro ? 1 : 0),
        base_legal: "CTN art. 38; Súmula 590/STF — ITCMD sobre o monte-mor líquido (após dedução de dívidas exigíveis do espólio).",
      },
      bens: bensCalculados.map(b => ({
        id: b.id,
        descricao: b.descricao,
        valor: b.valor,
        tipo_partilha: b.tipo_bem_partilha,
        meacao_conjuge: b.valor_meacao_conjuge,
        heranca_conjuge: b.valor_heranca_conjuge,
        heranca_filhos: b.valor_heranca_filhos,
      })),
      herdeiros: herdeirosCalculados.map(h => ({
        id: h.id,
        nome: h.nome,
        parentesco: h.parentesco,
        valor_parte: h.valor_parte,
        percentual: h.percentual_partilha,
        itcmd: h.valor_itcmd,
        renunciou: h._renunciou,
        cedeu_onerosa: h._cedeuOnerosa,
        cedeu_nao_onerosa: h._cedeuNaoOnerosa,
        contribuinte_itcmd: h._contribuinte_itcmd, // 'self' | 'cessionario' | null
        cessionario_nome: h._cedeuOnerosa ? (h.cessionario_nome || null) : null,
        cessionario_cpf: h._cedeuOnerosa ? (h.cessionario_cpf || null) : null,
      })),
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});