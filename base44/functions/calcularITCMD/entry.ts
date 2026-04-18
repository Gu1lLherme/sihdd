import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const { data_fato_gerador, tipo_transmissao, valor_bem, tipo_bem } = payload;

    if (!data_fato_gerador || !valor_bem) {
        return Response.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    const dataFato = new Date(data_fato_gerador);
    const anoFato = dataFato.getFullYear();

    // 1. Buscar valor da UFP para o ano do fato gerador
    const ufps = await base44.entities.HistoricoUFP.filter({ ano: anoFato });
    const ufpRecord = ufps[0]; 
    const valorUFP = ufpRecord ? ufpRecord.valor : null;

    if (!valorUFP) {
        // Fallback temporário se não tiver UFP cadastrado (apenas para não quebrar)
        // Idealmente deve retornar erro ou pedir cadastro
        return Response.json({ 
            error: `Valor da UFP não encontrado para o ano ${anoFato}. Cadastre em Legislação.`,
            calculo_parcial: true 
        }, { status: 404 });
    }

    // 2. Converter valor do bem para UFP
    const valorEmUFP = valor_bem / valorUFP;

    // 3. Buscar regras
    const todasRegras = await base44.entities.RegraITCMD.filter({ 
        tipo_transmissao: tipo_transmissao // 'causa_mortis' ou 'doacao'
    });

    const regraAplicavel = todasRegras.find(r => {
        const inicio = new Date(r.data_inicio_vigencia);
        const fim = r.data_fim_vigencia ? new Date(r.data_fim_vigencia) : new Date('2100-01-01');
        const dataValida = dataFato >= inicio && dataFato <= fim;
        
        let bemValido = true;
        if (r.tipo_bem && r.tipo_bem.length > 0 && tipo_bem) {
            bemValido = r.tipo_bem.includes(tipo_bem);
        }
        return dataValida && bemValido;
    });

    if (!regraAplicavel) {
        return Response.json({ error: 'Nenhuma regra encontrada para esta data/tipo. Verifique o cadastro de Legislação.' }, { status: 404 });
    }

    // 4. Calcular alíquota
    let aliquota = 0;
    const faixaEncontrada = regraAplicavel.faixas.find(f => {
        const min = f.min_ufp;
        const max = f.max_ufp || Infinity;
        return valorEmUFP > min && valorEmUFP <= max;
    });

    if (faixaEncontrada) {
        aliquota = faixaEncontrada.aliquota;
    }

    const valorImposto = valor_bem * (aliquota / 100);

    return Response.json({
        ufp_utilizado: valorUFP,
        valor_em_ufp: valorEmUFP,
        regra_utilizada: regraAplicavel.legislacao_referencia,
        aliquota_aplicada: aliquota,
        valor_imposto: valorImposto,
        detalhes: `Cálculo: ${aliquota}% sobre R$ ${valor_bem.toFixed(2)} (Ref: ${regraAplicavel.legislacao_referencia})`
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});