import { createClientFromRequest } from 'npm:@base44/sdk@0.8.3';

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
    // Pegar o UFP correto (considerando mês se houver mais de um, simplificado aqui para o primeiro encotrado do ano)
    const ufpRecord = ufps[0]; 
    const valorUFP = ufpRecord ? ufpRecord.valor : null;

    if (!valorUFP) {
        return Response.json({ 
            error: `Valor da UFP não encontrado para o ano ${anoFato}`,
            calculo_parcial: true 
        }, { status: 404 });
    }

    // 2. Converter valor do bem para UFP
    const valorEmUFP = valor_bem / valorUFP;

    // 3. Buscar regra aplicável
    // Filtra todas as regras e processa no código para encontrar a vigente na data
    const todasRegras = await base44.entities.RegraITCMD.filter({ 
        tipo_transmissao: tipo_transmissao // 'causa_mortis' ou 'doacao'
    });

    const regraAplicavel = todasRegras.find(r => {
        const inicio = new Date(r.data_inicio_vigencia);
        const fim = r.data_fim_vigencia ? new Date(r.data_fim_vigencia) : new Date('2100-01-01');
        
        const dataValida = dataFato >= inicio && dataFato <= fim;
        
        // Verifica tipo do bem se especificado na regra
        let bemValido = true;
        if (r.tipo_bem && r.tipo_bem.length > 0 && tipo_bem) {
            bemValido = r.tipo_bem.includes(tipo_bem);
        }

        return dataValida && bemValido;
    });

    if (!regraAplicavel) {
        return Response.json({ error: 'Nenhuma regra legislativa encontrada para esta data/tipo.' }, { status: 404 });
    }

    // 4. Calcular alíquota com base nas faixas
    let aliquota = 0;
    
    // Assumindo faixas progressivas simples ou teto. 
    // A lógica aqui depende se é progressiva (calcula por faixa) ou simples (encontra a faixa do total).
    // A Lei 9.297/2023 Sergipe parece usar alíquota sobre o TOTAL ("cujo valor seja igual ou inferior a...").
    // Art 14: "I - acima de X até Y, 3%". Isso geralmente indica alíquota sobre o montante que se enquadra, 
    // mas em alguns estados é progressiva por faixas. 
    // Vamos assumir a interpretação mais comum onde se enquadra o valor TOTAL na faixa.
    
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
        regra_utilizada: regraAplicavel.legislacao_id, // Pode melhorar buscando o titulo da lei
        aliquota_aplicada: aliquota,
        valor_imposto: valorImposto,
        detalhes: `Cálculo base: ${aliquota}% sobre R$ ${valor_bem.toFixed(2)}`
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});