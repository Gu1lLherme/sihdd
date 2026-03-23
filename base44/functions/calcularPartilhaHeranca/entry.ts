import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

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

    // 1. Buscar dados do caso
    const casos = await base44.entities.Caso.filter({ id: caso_id });
    const caso = casos[0];
    
    if (!caso) {
      return Response.json({ error: 'Caso não encontrado' }, { status: 404 });
    }

    const { regime_bens, data_casamento, conjuge_e_ascendente_herdeiros, data_obito } = caso;

    // 2. Buscar todos os bens do caso
    const bens = await base44.entities.Bem.filter({ caso_id });

    // 3. Buscar todos os herdeiros do caso
    const herdeiros = await base44.entities.Herdeiro.filter({ caso_id });
    
    // Filtrar apenas filhos (descendentes)
    const filhos = herdeiros.filter(h => 
      ['filho', 'filha', 'neto', 'neta'].includes(h.parentesco)
    );
    const qtdFilhos = filhos.length;
    const temFilhos = qtdFilhos > 0;

    // Verificar se todos os filhos são do cônjuge
    const todosFilhosSaoDoConjuge = filhos.every(f => f.e_filho_conjuge !== false);

    // Inicializar totais
    let totalMeacaoConjuge = 0;
    let totalHerancaConjuge = 0;
    let totalHerancaFilhos = 0;

    const dataCasamento = data_casamento ? new Date(data_casamento) : null;

    // 4. Calcular partilha para cada bem
    const bensCalculados = bens.map(bem => {
      const valorBem = bem.valor || 0;
      const dataAquisicao = bem.data_aquisicao ? new Date(bem.data_aquisicao) : null;
      const origemBem = bem.origem_bem || 'onerosa';

      let tipoBemPartilha = 'particular';
      let meacaoConjuge = 0;
      let herancaConjuge = 0;
      let herancaFilhos = 0;

      switch (regime_bens) {
        case 'comunhao_parcial':
        case 'uniao_estavel': // União estável segue comunhão parcial por padrão
          // Bem comum: adquirido após casamento de forma onerosa
          if (dataAquisicao && dataCasamento && dataAquisicao > dataCasamento && origemBem === 'onerosa') {
            tipoBemPartilha = 'comum';
            meacaoConjuge = valorBem * 0.50;
            herancaConjuge = 0; // Cônjuge não herda sobre bem comum
            herancaFilhos = valorBem * 0.50;
          } else {
            // Bem particular: adquirido antes do casamento ou por doação/herança
            tipoBemPartilha = 'particular';
            meacaoConjuge = 0;
            if (temFilhos) {
              herancaConjuge = valorBem / (qtdFilhos + 1);
              herancaFilhos = valorBem - herancaConjuge;
            } else {
              // Sem filhos: cônjuge herda tudo ou concorre com pais
              herancaConjuge = valorBem;
              herancaFilhos = 0;
            }
          }
          break;

        case 'comunhao_universal':
          // Todos os bens são comuns
          tipoBemPartilha = 'comum';
          meacaoConjuge = valorBem * 0.50;
          herancaConjuge = 0; // Cônjuge não herda (já tem meação de tudo)
          herancaFilhos = valorBem * 0.50;
          break;

        case 'separacao_total':
        case 'participacao_final':
          // Todos os bens são particulares, cônjuge concorre com filhos
          tipoBemPartilha = 'particular';
          meacaoConjuge = 0;
          if (temFilhos) {
            herancaConjuge = valorBem / (qtdFilhos + 1);
            herancaFilhos = valorBem - herancaConjuge;
          } else {
            herancaConjuge = valorBem;
            herancaFilhos = 0;
          }
          break;

        case 'separacao_obrigatoria':
          // Cônjuge não herda (salvo prova de esforço comum)
          tipoBemPartilha = 'particular';
          meacaoConjuge = 0;
          herancaConjuge = 0;
          herancaFilhos = valorBem;
          break;

        default:
          // Padrão: comunhão parcial
          tipoBemPartilha = 'particular';
          meacaoConjuge = 0;
          herancaConjuge = temFilhos ? valorBem / (qtdFilhos + 1) : valorBem;
          herancaFilhos = temFilhos ? valorBem - herancaConjuge : 0;
      }

      totalMeacaoConjuge += meacaoConjuge;
      totalHerancaConjuge += herancaConjuge;
      totalHerancaFilhos += herancaFilhos;

      return {
        ...bem,
        tipo_bem_partilha: tipoBemPartilha,
        valor_meacao_conjuge: meacaoConjuge,
        valor_heranca_conjuge: herancaConjuge,
        valor_heranca_filhos: herancaFilhos
      };
    });

    // 5. Aplicar regra dos 25%
    const totalHeranca = totalHerancaConjuge + totalHerancaFilhos;
    const minimoConjuge25 = totalHeranca * 0.25;

    if (
      (regime_bens === 'comunhao_parcial' || regime_bens === 'separacao_total') &&
      conjuge_e_ascendente_herdeiros &&
      todosFilhosSaoDoConjuge &&
      temFilhos &&
      totalHerancaConjuge < minimoConjuge25
    ) {
      // Ajustar para garantir mínimo de 25%
      const diferenca = minimoConjuge25 - totalHerancaConjuge;
      totalHerancaConjuge = minimoConjuge25;
      totalHerancaFilhos = totalHeranca - totalHerancaConjuge;
    }

    // 6. Calcular parte de cada filho
    const valorPorFilho = temFilhos ? totalHerancaFilhos / qtdFilhos : 0;

    // 7. Buscar UFP e regras para calcular ITCMD
    const anoObito = new Date(data_obito).getFullYear();
    const ufps = await base44.entities.HistoricoUFP.filter({ ano: anoObito });
    const valorUFP = ufps[0]?.valor || 100; // Fallback

    const regras = await base44.entities.RegraITCMD.filter({ tipo_transmissao: 'causa_mortis' });
    const dataObito = new Date(data_obito);
    
    const regraAplicavel = regras.find(r => {
      const inicio = new Date(r.data_inicio_vigencia);
      const fim = r.data_fim_vigencia ? new Date(r.data_fim_vigencia) : new Date('2100-01-01');
      return dataObito >= inicio && dataObito <= fim;
    });

    // Função auxiliar para calcular ITCMD
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

    // 8. Calcular ITCMD para cada herdeiro
    const herdeirosCalculados = herdeiros.map(h => {
      let valorParte = 0;
      
      if (['filho', 'filha', 'neto', 'neta'].includes(h.parentesco)) {
        valorParte = valorPorFilho;
      } else if (h.parentesco === 'conjuge') {
        valorParte = totalHerancaConjuge;
      }
      
      const itcmd = calcularITCMD(valorParte);
      const percentualPartilha = totalHeranca > 0 ? (valorParte / totalHeranca) * 100 : 0;

      return {
        ...h,
        valor_parte: valorParte,
        valor_itcmd: itcmd,
        percentual_partilha: percentualPartilha
      };
    });

    // Calcular ITCMD do cônjuge sobre herança (não sobre meação)
    const itcmdConjuge = calcularITCMD(totalHerancaConjuge);
    const itcmdTotalFilhos = herdeirosCalculados
      .filter(h => ['filho', 'filha', 'neto', 'neta'].includes(h.parentesco))
      .reduce((sum, h) => sum + (h.valor_itcmd || 0), 0);
    
    const itcmdTotal = itcmdConjuge + itcmdTotalFilhos;

    // 9. Atualizar entidades no banco
    for (const bem of bensCalculados) {
      await base44.asServiceRole.entities.Bem.update(bem.id, {
        tipo_bem_partilha: bem.tipo_bem_partilha,
        valor_meacao_conjuge: bem.valor_meacao_conjuge,
        valor_heranca_conjuge: bem.valor_heranca_conjuge,
        valor_heranca_filhos: bem.valor_heranca_filhos
      });
    }

    for (const herdeiro of herdeirosCalculados) {
      await base44.asServiceRole.entities.Herdeiro.update(herdeiro.id, {
        valor_parte: herdeiro.valor_parte,
        valor_itcmd: herdeiro.valor_itcmd,
        percentual_partilha: herdeiro.percentual_partilha
      });
    }

    // Atualizar caso
    const valorPatrimonio = bens.reduce((sum, b) => sum + (b.valor || 0), 0);
    await base44.asServiceRole.entities.Caso.update(caso_id, {
      valor_patrimonio: valorPatrimonio,
      valor_meacao_conjuge: totalMeacaoConjuge,
      valor_heranca_conjuge: totalHerancaConjuge,
      valor_heranca_filhos: totalHerancaFilhos,
      valor_itcmd: itcmdTotal,
      aliquota: regraAplicavel?.faixas?.[0]?.aliquota || 0
    });

    return Response.json({
      sucesso: true,
      resumo: {
        regime_bens,
        valor_patrimonio: valorPatrimonio,
        meacao_conjuge: totalMeacaoConjuge,
        heranca_conjuge: totalHerancaConjuge,
        heranca_filhos: totalHerancaFilhos,
        itcmd_total: itcmdTotal,
        regra_25_aplicada: totalHerancaConjuge === minimoConjuge25 && minimoConjuge25 > 0
      },
      bens: bensCalculados.map(b => ({
        id: b.id,
        descricao: b.descricao,
        valor: b.valor,
        tipo_partilha: b.tipo_bem_partilha,
        meacao_conjuge: b.valor_meacao_conjuge,
        heranca_conjuge: b.valor_heranca_conjuge,
        heranca_filhos: b.valor_heranca_filhos
      })),
      herdeiros: herdeirosCalculados.map(h => ({
        id: h.id,
        nome: h.nome,
        parentesco: h.parentesco,
        valor_parte: h.valor_parte,
        percentual: h.percentual_partilha,
        itcmd: h.valor_itcmd
      }))
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});