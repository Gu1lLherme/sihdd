import { createClientFromRequest } from 'npm:@base44/sdk@0.8.3';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { file_urls } = await req.json();

    if (!file_urls || !Array.isArray(file_urls) || file_urls.length === 0) {
      return Response.json({ error: 'Lista de URLs de arquivos é obrigatória' }, { status: 400 });
    }

    // Usar InvokeLLM para extrair dados dos PDFs
    const extractionResult = await base44.integrations.Core.InvokeLLM({
      prompt: `Analise os arquivos de legislação anexados (Leis do Estado de Sergipe sobre ITCMD) e extraia os dados para preencher o banco de dados.
      
      RETORNE APENAS UM JSON com a seguinte estrutura:
      {
        "legislacoes": [
          { "titulo": "Lei nº X", "data_publicacao": "YYYY-MM-DD", "descricao": "...", "status": "vigente" | "revogada" }
        ],
        "historico_ufp": [
          { "ano": 2024, "valor": 57.16, "mes_inicio": 1, "mes_fim": 12 }
        ],
        "regras": [
          {
            "legislacao_referencia": "Lei nº X",
            "tipo_transmissao": "causa_mortis" | "doacao",
            "data_inicio_vigencia": "YYYY-MM-DD",
            "data_fim_vigencia": "YYYY-MM-DD" | null,
            "tipo_bem": ["imovel", "movel"],
            "faixas": [
              { "min_ufp": 0, "max_ufp": 500, "aliquota": 0 },
              { "min_ufp": 500, "max_ufp": 10000, "aliquota": 3 }
            ],
            "condicoes_especiais": "..."
          }
        ]
      }
      
      Importante:
      1. Identifique as leis principais (7.724/2013) e suas alterações.
      2. Extraia o histórico de valores da UFP/SE se disponível nos textos.
      3. Monte as regras de alíquotas considerando os períodos de vigência de cada lei.
      4. Atente-se às isenções (alíquota 0).
      5. Se houver regras temporárias (como na Lei 9.774/2025), inclua com as datas corretas.`,
      file_urls: file_urls,
      response_json_schema: {
        type: "object",
        properties: {
          legislacoes: { type: "array", items: { type: "object", properties: { titulo: { type: "string" }, data_publicacao: { type: "string" }, descricao: { type: "string" }, status: { type: "string" } } } },
          historico_ufp: { type: "array", items: { type: "object", properties: { ano: { type: "integer" }, valor: { type: "number" }, mes_inicio: { type: "integer" }, mes_fim: { type: "integer" } } } },
          regras: { 
            type: "array", 
            items: { 
              type: "object", 
              properties: { 
                legislacao_referencia: { type: "string" }, 
                tipo_transmissao: { type: "string" }, 
                data_inicio_vigencia: { type: "string" }, 
                data_fim_vigencia: { type: ["string", "null"] }, 
                tipo_bem: { type: "array", items: { type: "string" } },
                faixas: { type: "array", items: { type: "object", properties: { min_ufp: { type: "number" }, max_ufp: { type: ["number", "null"] }, aliquota: { type: "number" } } } },
                condicoes_especiais: { type: "string" }
              } 
            } 
          }
        }
      }
    });

    const data = extractionResult;

    // Inserir dados no banco
    const results = {
      legislacoes: 0,
      ufp: 0,
      regras: 0
    };

    if (data.legislacoes) {
        // Limpar dados existentes para evitar duplicação (opcional, aqui vamos apenas criar)
        // Idealmente faríamos upsert, mas 'create' é mais simples para este exemplo
        await base44.asServiceRole.entities.Legislacao.bulkCreate(data.legislacoes);
        results.legislacoes = data.legislacoes.length;
    }

    if (data.historico_ufp) {
        await base44.asServiceRole.entities.HistoricoUFP.bulkCreate(data.historico_ufp);
        results.ufp = data.historico_ufp.length;
    }

    if (data.regras) {
        await base44.asServiceRole.entities.RegraITCMD.bulkCreate(data.regras);
        results.regras = data.regras.length;
    }

    return Response.json({ success: true, inserted: results, raw_data: data });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});