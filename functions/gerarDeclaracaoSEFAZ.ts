// =============================================================================
// FUNÇÃO: gerarDeclaracaoSEFAZ
// DESCRIÇÃO: Gera a Declaração do ITCMD "Causa Mortis" preenchendo o template
//            PDF oficial da SEFAZ/SE via overlay (pdf-lib drawText).
// ARQUITETURA: Opção B - Overlay sobre PDF estático (sem AcroForm).
// =============================================================================

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { PDFDocument, StandardFonts, rgb } from 'npm:pdf-lib@1.17.1';

// --- URL do template PDF oficial da SEFAZ (hospedado no storage público) ---
const TEMPLATE_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690dfe3076922dca90cee92f/d7ec4ff56_DECLARACAO_ITCMD_CAUSA_MORTIS.pdf';

// --- Labels de mapeamento ---
const REGIME_LABELS = {
  uniao_estavel: "Uniao Estavel",
  comunhao_universal: "Comunhao Universal",
  comunhao_parcial: "Comunhao Parcial",
  separacao_total: "Separacao Total",
  separacao_obrigatoria: "Separacao Obrigatoria",
  participacao_final: "Participacao Final"
};

const ESTADO_CIVIL_LABELS = {
  solteiro: "Solteiro(a)",
  casado: "Casado(a)",
  divorciado: "Divorciado(a)",
  viuvo: "Viuvo(a)",
  uniao_estavel: "Uniao Estavel",
  separado_judicialmente: "Separado(a) Judicialmente"
};

// =============================================================================
// DICIONÁRIO DE COORDENADAS (X, Y)
// Nota: Y é medido a partir da BASE da página no pdf-lib (origem inferior-esquerda).
// A página A4 tem ~842 pontos de altura. Para converter de "topo" para "base":
//   y_pdflib = 842 - y_do_topo
// AJUSTE ESTES VALORES conforme necessário (tentativa e erro).
// =============================================================================
const COORDS = {
  // --- Seção 2: Dados do Inventário ---
  checkExtrajudicialInv:   { x: 44, y: 698 },   // "( X )" Inventário Extrajudicial
  checkExtrajudicialSob:   { x: 330, y: 698 },   // "( X )" Sobrepartilha Extrajudicial
  dataAberturaInventario:  { x: 195, y: 686 },   // Data de Abertura do Inventário
  checkJudicialInv:        { x: 44, y: 670 },    // "( X )" Inventário Judicial
  checkJudicialSob:        { x: 330, y: 670 },   // "( X )" Sobrepartilha Judicial
  dataDistribuicao:        { x: 155, y: 658 },
  processoNum:             { x: 125, y: 646 },
  varaComarca:             { x: 130, y: 634 },
  dataHomologacaoPartilha: { x: 190, y: 622 },
  dataTransitoJulgado:     { x: 185, y: 610 },
  processoSobrepartilhaNum:{ x: 435, y: 658 },
  varaComarcaSob:          { x: 400, y: 646 },
  dataHomologacaoSob:      { x: 455, y: 634 },
  dataTransitoJulgadoSob:  { x: 445, y: 622 },

  // --- Seção 3.1: Inventariado ---
  nomeInventariado:        { x: 68, y: 570 },
  cpfInventariado:         { x: 420, y: 570 },
  dataObito:               { x: 95, y: 556 },
  estadoCivil:             { x: 218, y: 556 },
  regimeBens:              { x: 340, y: 556 },
  dataCasamento:           { x: 490, y: 556 },

  // --- Seção 3.2: Inventariante ---
  nomeInventariante:       { x: 68, y: 530 },
  cpfInventariante:        { x: 420, y: 530 },
  enderecoInventariante:   { x: 110, y: 516 },
  telefoneEmailInv:        { x: 420, y: 516 },

  // --- Seção 4: Bens (linhas dinâmicas, Y decresce para cada bem) ---
  bensStartY:              490,   // Y da primeira linha de bens
  bensRowHeight:           12,    // Espaçamento entre linhas
  bensItemX:               32,    // Coluna "Item"
  bensDescX:               75,    // Coluna "Descrição"
  bensMatriculaX:          340,   // Coluna "Matrícula"
  bensInscricaoX:          430,   // Coluna "Inscrição Municipal"
  bensValorX:              520,   // Coluna "Valor (R$)"

  // --- Seção 5: Dívidas (linhas dinâmicas) ---
  dividasStartY:           400,   // Y da primeira linha de dívidas
  dividasRowHeight:        12,
  dividasItemX:            32,
  dividasDescX:            75,
  dividasValorX:           520,

  // --- Seção 6: Cessão ---
  checkCessaoOnerosa:      { x: 44, y: 355 },
  checkCessaoNaoOnerosa:   { x: 330, y: 355 },

  // --- Seção 7: Renúncia ---
  checkRenunciaTermoJud:   { x: 44, y: 335 },
  checkRenunciaEscritura:  { x: 330, y: 335 },

  // --- Seção 8: Partilha (linhas dinâmicas) ---
  partilhaStartY:          300,
  partilhaRowHeight:       12,
  partilhaNomeX:           30,
  partilhaPercX:           195,
  partilhaQuinhaoRealX:    300,
  partilhaQuinhaoLegalX:   395,
  partilhaExcedenteX:      500,

  // --- Seção 9: Uso do Cartório ---
  cartorioNome:            { x: 65, y: 218 },
  cartorioMunicipio:       { x: 260, y: 218 },
  cartorioComarca:         { x: 420, y: 218 },

  // --- Seção 10: Cálculo do Imposto ---
  dataVencimento:          { x: 40, y: 168 },
  monteMor:                { x: 145, y: 168 },
  dividaEspolio:           { x: 255, y: 168 },
  meacaoConjugalLegal:     { x: 360, y: 168 },
  montePartivel:           { x: 475, y: 168 },

  baseCalculo:             { x: 40, y: 145 },
  aliquota:                { x: 145, y: 145 },
  principal:               { x: 225, y: 145 },
  atualizacao:             { x: 330, y: 145 },
  multa:                   { x: 425, y: 145 },
  juros:                   { x: 510, y: 145 },

  desconto:                { x: 40, y: 125 },
  totalPagar:              { x: 145, y: 125 },
  dataPagamentoDAE:        { x: 265, y: 125 },
  numDAE:                  { x: 385, y: 125 },

  numParcelamento:         { x: 115, y: 110 },
  baseLegalIsencao:        { x: 375, y: 110 },

  // --- Seção 11: Responsável ---
  respLocalData:           { x: 45, y: 78 },
  respNome:                { x: 190, y: 78 },
  respCPF:                 { x: 370, y: 78 },
};

// =============================================================================
// FUNÇÕES UTILITÁRIAS
// =============================================================================

// Formata número para padrão BRL: "R$ 139.120,00"
function fmtBRL(value) {
  const num = value || 0;
  // Formata manualmente para evitar problemas de locale no Deno
  const parts = num.toFixed(2).split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${intPart},${parts[1]}`;
}

// Formata data ISO para "dd/mm/aaaa"
function fmtDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Remove acentos para compatibilidade com WinAnsi/Helvetica padrão
function removeAccents(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// =============================================================================
// HANDLER PRINCIPAL
// =============================================================================
Deno.serve(async (req) => {
  try {
    // --- Autenticação ---
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // --- Payload ---
    const payload = await req.json();
    const { caso_id } = payload;
    if (!caso_id) {
      return Response.json({ error: 'caso_id e obrigatorio' }, { status: 400 });
    }

    // --- Busca de dados das entidades ---
    const caso = await base44.entities.Caso.get(caso_id);
    if (!caso) {
      return Response.json({ error: 'Caso nao encontrado' }, { status: 404 });
    }

    const herdeiros = await base44.entities.Herdeiro.filter({ caso_id });
    const bens = await base44.entities.Bem.filter({ caso_id });
    const dividas = await base44.entities.Divida.filter({ caso_id });
    const inventariantes = await base44.entities.Inventariante.filter({ caso_id });
    const inventariante = inventariantes[0];

    let guias = [];
    try { guias = await base44.entities.GuiaDAE.filter({ caso_id }); } catch (_e) { /* sem guias */ }
    const guia = guias[0];

    // =========================================================================
    // REGRAS DE NEGÓCIO - Cálculos Financeiros
    // =========================================================================
    const monteMor = bens.reduce((sum, b) => sum + (b.valor || 0), 0);
    const totalDividas = dividas.reduce((sum, d) => sum + (d.valor || 0), 0);
    const meacaoLegal = caso.valor_meacao_conjuge || 0;
    const montePartivel = monteMor - totalDividas - meacaoLegal;
    const baseCalculo = montePartivel > 0 ? montePartivel : 0;
    const aliquota = caso.aliquota || 4;
    const principal = baseCalculo * (aliquota / 100);
    const atualizacao = caso.valor_atualizacao || 0;
    const multa = caso.valor_multa || 0;
    const juros = caso.valor_juros || 0;
    const desconto = caso.valor_desconto || 0;
    const totalPagar = principal + atualizacao + multa + juros - desconto;

    // =========================================================================
    // CARREGAMENTO DO TEMPLATE PDF
    // =========================================================================
    const templateBytes = await fetch(TEMPLATE_URL).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(templateBytes);

    // Embutir fonte Helvetica (suporta WinAnsi - caracteres latinos básicos)
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const page = pdfDoc.getPages()[0];
    const fontSize = 8;
    const smallFont = 7;
    const color = rgb(0, 0, 0);

    // Helper: desenha texto na página com remoção de acentos
    function draw(text, x, y, opts = {}) {
      const { size = fontSize, bold = false, maxLen = 60 } = opts;
      let clean = removeAccents(String(text || ''));
      if (clean.length > maxLen) clean = clean.substring(0, maxLen);
      page.drawText(clean, {
        x,
        y,
        size,
        font: bold ? fontBold : font,
        color,
      });
    }

    // Helper: desenha um "X" para checkboxes
    function check(coords) {
      draw('X', coords.x, coords.y, { size: 9, bold: true });
    }

    // =========================================================================
    // PREENCHIMENTO - Seção 2: Dados do Inventário
    // =========================================================================
    const tipoInv = caso.tipo_inventario || 'extrajudicial';
    const tipoProc = caso.tipo_processo || 'inventario';

    if (tipoInv === 'extrajudicial' && tipoProc === 'inventario') {
      check(COORDS.checkExtrajudicialInv);
      draw(fmtDate(caso.data_abertura_inventario), COORDS.dataAberturaInventario.x, COORDS.dataAberturaInventario.y);
    }
    if (tipoInv === 'extrajudicial' && tipoProc === 'sobrepartilha') {
      check(COORDS.checkExtrajudicialSob);
    }
    if (tipoInv === 'judicial' && tipoProc === 'inventario') {
      check(COORDS.checkJudicialInv);
      draw(fmtDate(caso.data_distribuicao), COORDS.dataDistribuicao.x, COORDS.dataDistribuicao.y);
      draw(caso.numero_processo_judicial, COORDS.processoNum.x, COORDS.processoNum.y);
      draw(caso.vara_comarca, COORDS.varaComarca.x, COORDS.varaComarca.y);
      draw(fmtDate(caso.data_homologacao_partilha), COORDS.dataHomologacaoPartilha.x, COORDS.dataHomologacaoPartilha.y);
      draw(fmtDate(caso.data_transito_julgado), COORDS.dataTransitoJulgado.x, COORDS.dataTransitoJulgado.y);
    }
    if (tipoInv === 'judicial' && tipoProc === 'sobrepartilha') {
      check(COORDS.checkJudicialSob);
      draw(caso.numero_sobrepartilha, COORDS.processoSobrepartilhaNum.x, COORDS.processoSobrepartilhaNum.y);
      draw(caso.vara_comarca_sobrepartilha, COORDS.varaComarcaSob.x, COORDS.varaComarcaSob.y);
      draw(fmtDate(caso.data_homologacao_sobrepartilha), COORDS.dataHomologacaoSob.x, COORDS.dataHomologacaoSob.y);
      draw(fmtDate(caso.data_transito_julgado_sobrepartilha), COORDS.dataTransitoJulgadoSob.x, COORDS.dataTransitoJulgadoSob.y);
    }

    // =========================================================================
    // PREENCHIMENTO - Seção 3.1: Inventariado
    // =========================================================================
    draw(caso.nome_falecido, COORDS.nomeInventariado.x, COORDS.nomeInventariado.y, { maxLen: 45 });
    draw(caso.cpf_falecido, COORDS.cpfInventariado.x, COORDS.cpfInventariado.y);
    draw(fmtDate(caso.data_obito), COORDS.dataObito.x, COORDS.dataObito.y);
    draw(ESTADO_CIVIL_LABELS[caso.estado_civil] || '', COORDS.estadoCivil.x, COORDS.estadoCivil.y);
    draw(REGIME_LABELS[caso.regime_bens] || '', COORDS.regimeBens.x, COORDS.regimeBens.y, { size: smallFont, maxLen: 25 });
    draw(fmtDate(caso.data_casamento), COORDS.dataCasamento.x, COORDS.dataCasamento.y);

    // =========================================================================
    // PREENCHIMENTO - Seção 3.2: Inventariante
    // =========================================================================
    draw(inventariante?.nome, COORDS.nomeInventariante.x, COORDS.nomeInventariante.y, { maxLen: 45 });
    draw(inventariante?.cpf_cnpj, COORDS.cpfInventariante.x, COORDS.cpfInventariante.y);
    draw(inventariante?.endereco, COORDS.enderecoInventariante.x, COORDS.enderecoInventariante.y, { size: smallFont, maxLen: 50 });
    const telEmail = [inventariante?.telefone, inventariante?.email].filter(Boolean).join(' / ');
    draw(telEmail, COORDS.telefoneEmailInv.x, COORDS.telefoneEmailInv.y, { size: smallFont, maxLen: 30 });

    // =========================================================================
    // PREENCHIMENTO - Seção 4: Bens (linhas dinâmicas)
    // =========================================================================
    bens.forEach((bem, idx) => {
      const rowY = COORDS.bensStartY - (idx * COORDS.bensRowHeight);
      if (rowY < 410) return; // Limita para não sobrepor seções abaixo
      draw(`${idx + 1}`, COORDS.bensItemX, rowY, { size: smallFont });
      draw(bem.descricao, COORDS.bensDescX, rowY, { size: smallFont, maxLen: 40 });
      const isImovel = ['imovel', 'casa', 'terreno'].includes(bem.tipo);
      if (isImovel) draw(bem.identificacao, COORDS.bensMatriculaX, rowY, { size: smallFont, maxLen: 18 });
      draw(fmtBRL(bem.valor), COORDS.bensValorX, rowY, { size: smallFont, maxLen: 18 });
    });

    // =========================================================================
    // PREENCHIMENTO - Seção 5: Dívidas (linhas dinâmicas)
    // =========================================================================
    dividas.forEach((d, idx) => {
      const rowY = COORDS.dividasStartY - (idx * COORDS.dividasRowHeight);
      if (rowY < 360) return;
      draw(`${idx + 1}`, COORDS.dividasItemX, rowY, { size: smallFont });
      draw(d.titulo || d.descricao, COORDS.dividasDescX, rowY, { size: smallFont, maxLen: 55 });
      draw(fmtBRL(d.valor), COORDS.dividasValorX, rowY, { size: smallFont, maxLen: 18 });
    });

    // =========================================================================
    // PREENCHIMENTO - Seção 6: Cessão de Direitos
    // =========================================================================
    const cessao = caso.cessao_direitos || 'nenhuma';
    if (cessao === 'onerosa') check(COORDS.checkCessaoOnerosa);
    if (cessao === 'nao_onerosa') check(COORDS.checkCessaoNaoOnerosa);

    // =========================================================================
    // PREENCHIMENTO - Seção 7: Renúncia Abdicativa
    // =========================================================================
    const renuncia = caso.renuncia_abdicativa || 'nenhuma';
    if (renuncia === 'termo_judicial') check(COORDS.checkRenunciaTermoJud);
    if (renuncia === 'escritura_publica') check(COORDS.checkRenunciaEscritura);

    // =========================================================================
    // PREENCHIMENTO - Seção 8: Partilha (linhas dinâmicas)
    // =========================================================================
    let partilhaIdx = 0;

    // Cônjuge meeiro
    if (caso.conjuge_nome && ((caso.valor_meacao_conjuge || 0) > 0 || (caso.valor_heranca_conjuge || 0) > 0)) {
      const rowY = COORDS.partilhaStartY - (partilhaIdx * COORDS.partilhaRowHeight);
      draw(`${caso.conjuge_nome} (Meeiro)`, COORDS.partilhaNomeX, rowY, { size: smallFont, maxLen: 28 });
      const totalConj = (caso.valor_meacao_conjuge || 0) + (caso.valor_heranca_conjuge || 0);
      const perc = monteMor > 0 ? ((totalConj / monteMor) * 100).toFixed(2) + '%' : '';
      draw(perc, COORDS.partilhaPercX, rowY, { size: smallFont });
      draw(fmtBRL(caso.valor_meacao_conjuge), COORDS.partilhaQuinhaoRealX, rowY, { size: smallFont, maxLen: 18 });
      draw(fmtBRL(caso.valor_heranca_conjuge), COORDS.partilhaQuinhaoLegalX, rowY, { size: smallFont, maxLen: 18 });
      draw(fmtBRL(0), COORDS.partilhaExcedenteX, rowY, { size: smallFont, maxLen: 18 });
      partilhaIdx++;
    }

    // Herdeiros
    herdeiros.filter(h => h.parentesco !== 'conjuge').forEach(h => {
      const rowY = COORDS.partilhaStartY - (partilhaIdx * COORDS.partilhaRowHeight);
      if (rowY < 245) return; // Limita para não sobrepor nota/seção 9
      const cond = h.parentesco ? h.parentesco.charAt(0).toUpperCase() + h.parentesco.slice(1) : '';
      draw(`${h.nome} (${cond})`, COORDS.partilhaNomeX, rowY, { size: smallFont, maxLen: 28 });
      draw(h.fracao_bens || `${(h.percentual_partilha || 0).toFixed(2)}%`, COORDS.partilhaPercX, rowY, { size: smallFont });
      draw(fmtBRL(h.valor_meacao_quinhao_real || h.valor_parte), COORDS.partilhaQuinhaoRealX, rowY, { size: smallFont, maxLen: 18 });
      draw(fmtBRL(h.valor_meacao_quinhao_legal || h.valor_parte), COORDS.partilhaQuinhaoLegalX, rowY, { size: smallFont, maxLen: 18 });
      draw(fmtBRL(h.valor_excedente_meacao || 0), COORDS.partilhaExcedenteX, rowY, { size: smallFont, maxLen: 18 });
      partilhaIdx++;
    });

    // =========================================================================
    // PREENCHIMENTO - Seção 9: Uso do Cartório
    // =========================================================================
    draw(caso.cartorio_nome, COORDS.cartorioNome.x, COORDS.cartorioNome.y, { maxLen: 30 });
    draw(caso.cartorio_municipio, COORDS.cartorioMunicipio.x, COORDS.cartorioMunicipio.y, { maxLen: 20 });
    draw(caso.cartorio_comarca, COORDS.cartorioComarca.x, COORDS.cartorioComarca.y, { maxLen: 20 });

    // =========================================================================
    // PREENCHIMENTO - Seção 10: Cálculo do Imposto
    // =========================================================================
    draw(guia ? fmtDate(guia.data_vencimento) : '', COORDS.dataVencimento.x, COORDS.dataVencimento.y);
    draw(fmtBRL(monteMor), COORDS.monteMor.x, COORDS.monteMor.y, { size: smallFont });
    draw(fmtBRL(totalDividas), COORDS.dividaEspolio.x, COORDS.dividaEspolio.y, { size: smallFont });
    draw(fmtBRL(meacaoLegal), COORDS.meacaoConjugalLegal.x, COORDS.meacaoConjugalLegal.y, { size: smallFont });
    draw(fmtBRL(montePartivel), COORDS.montePartivel.x, COORDS.montePartivel.y, { size: smallFont });

    draw(fmtBRL(baseCalculo), COORDS.baseCalculo.x, COORDS.baseCalculo.y, { size: smallFont });
    draw(`${aliquota}%`, COORDS.aliquota.x, COORDS.aliquota.y, { size: smallFont });
    draw(fmtBRL(principal), COORDS.principal.x, COORDS.principal.y, { size: smallFont });
    draw(fmtBRL(atualizacao), COORDS.atualizacao.x, COORDS.atualizacao.y, { size: smallFont });
    draw(fmtBRL(multa), COORDS.multa.x, COORDS.multa.y, { size: smallFont });
    draw(fmtBRL(juros), COORDS.juros.x, COORDS.juros.y, { size: smallFont });

    draw(fmtBRL(desconto), COORDS.desconto.x, COORDS.desconto.y, { size: smallFont });
    draw(fmtBRL(totalPagar), COORDS.totalPagar.x, COORDS.totalPagar.y, { size: smallFont, bold: true });
    draw(guia ? fmtDate(guia.data_pagamento) : '', COORDS.dataPagamentoDAE.x, COORDS.dataPagamentoDAE.y, { size: smallFont });
    draw(guia?.numero_guia || '', COORDS.numDAE.x, COORDS.numDAE.y, { size: smallFont });
    draw(caso.base_legal_isencao, COORDS.baseLegalIsencao.x, COORDS.baseLegalIsencao.y, { size: smallFont, maxLen: 30 });

    // =========================================================================
    // PREENCHIMENTO - Seção 11: Responsável
    // =========================================================================
    const hoje = new Date();
    const hojeStr = `${String(hoje.getDate()).padStart(2,'0')}/${String(hoje.getMonth()+1).padStart(2,'0')}/${hoje.getFullYear()}`;
    draw(`${removeAccents(caso.cartorio_municipio || 'Aracaju')}, ${hojeStr}`, COORDS.respLocalData.x, COORDS.respLocalData.y, { size: smallFont, maxLen: 25 });
    draw(inventariante?.nome || user.full_name, COORDS.respNome.x, COORDS.respNome.y, { size: smallFont, maxLen: 28 });
    draw(inventariante?.cpf_cnpj, COORDS.respCPF.x, COORDS.respCPF.y, { size: smallFont });

    // =========================================================================
    // SERIALIZAÇÃO E RESPOSTA
    // =========================================================================
    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=Declaracao_ITCMD_${caso.numero_caso || caso.id}.pdf`
      }
    });

  } catch (error) {
    console.error('Erro ao gerar declaracao SEFAZ:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});