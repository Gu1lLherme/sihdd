import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { jsPDF } from 'npm:jspdf@2.5.2';

const REGIME_LABELS = {
  uniao_estavel: "União Estável",
  comunhao_universal: "Comunhão Universal",
  comunhao_parcial: "Comunhão Parcial",
  separacao_total: "Separação Total",
  separacao_obrigatoria: "Separação Obrigatória",
  participacao_final: "Participação Final"
};

const ESTADO_CIVIL_LABELS = {
  solteiro: "Solteiro(a)",
  casado: "Casado(a)",
  divorciado: "Divorciado(a)",
  viuvo: "Viúvo(a)",
  uniao_estavel: "União Estável",
  separado_judicialmente: "Separado(a) Judicialmente"
};

function fmt(value) {
  return (value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR');
}

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

    const caso = await base44.entities.Caso.get(caso_id);
    if (!caso) {
      return Response.json({ error: 'Caso não encontrado' }, { status: 404 });
    }

    const herdeiros = await base44.entities.Herdeiro.filter({ caso_id });
    const bens = await base44.entities.Bem.filter({ caso_id });
    const dividas = await base44.entities.Divida.filter({ caso_id });
    const inventariantes = await base44.entities.Inventariante.filter({ caso_id });
    const inventariante = inventariantes[0];

    let guias = [];
    try { guias = await base44.entities.GuiaDAE.filter({ caso_id }); } catch(e) {}
    const guia = guias[0];

    const doc = new jsPDF('p', 'mm', 'a4');
    const pw = 210;
    const ph = 297;
    const ml = 10; // margin left
    const mr = 10; // margin right
    const cw = pw - ml - mr; // content width
    let y = 8;

    const lw = 0.3; // line width
    doc.setLineWidth(lw);
    doc.setDrawColor(0);

    // Helper: draw a cell with border and text
    function cell(x, cy, w, h, text, opts = {}) {
      const { fontSize = 7, bold = false, italic = false, fill = false, align = 'left', padding = 1.5, noBorder = false, topBorder = true, bottomBorder = true, leftBorder = true, rightBorder = true } = opts;
      if (fill) {
        doc.setFillColor(210, 210, 210);
        doc.rect(x, cy, w, h, 'F');
      }
      if (!noBorder) {
        if (topBorder) doc.line(x, cy, x + w, cy);
        if (bottomBorder) doc.line(x, cy + h, x + w, cy + h);
        if (leftBorder) doc.line(x, cy, x, cy + h);
        if (rightBorder) doc.line(x + w, cy, x + w, cy + h);
      }
      const style = bold && italic ? 'bolditalic' : bold ? 'bold' : italic ? 'italic' : 'normal';
      doc.setFont('helvetica', style);
      doc.setFontSize(fontSize);
      if (text) {
        const tx = align === 'center' ? x + w / 2 : align === 'right' ? x + w - padding : x + padding;
        const ty = cy + h / 2 + fontSize * 0.12;
        doc.text(String(text), tx, ty, { align: align === 'center' ? 'center' : align === 'right' ? 'right' : 'left', maxWidth: w - padding * 2 });
      }
    }

    // Helper: draw a full-width section header
    function sectionHeader(cy, text, h = 5.5) {
      cell(ml, cy, cw, h, text, { bold: true, fontSize: 7, fill: true });
      return cy + h;
    }

    // Helper: check page break
    function checkPage(needed) {
      if (y + needed > ph - 12) {
        doc.addPage();
        y = 8;
        return true;
      }
      return false;
    }

    // ========== HEADER ==========
    // "Impresso em 3 vias" top right
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6);
    doc.text('Impresso em 3 vias', pw - mr, y + 2, { align: 'right' });

    // Government header (left side)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Governo de Sergipe', ml + 2, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Secretaria de Estado da Fazenda', ml + 2, y + 9);
    doc.text('Coordenadoria do ITCMD', ml + 2, y + 13);

    // Box "1. Nº da Declaração" (top right)
    const boxW = 52;
    const boxH = 14;
    const boxX = pw - mr - boxW;
    const boxY = y + 2;
    doc.rect(boxX, boxY, boxW, boxH);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text('1. Nº da Declaração do ITCMD (Uso da', boxX + 2, boxY + 4);
    doc.text('SEFAZ)', boxX + 2, boxY + 8);

    y += 19;

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('DECLARAÇÃO DO ITCMD "CAUSA MORTIS"', pw / 2, y, { align: 'center' });
    y += 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('(Inventário/ Sobrepartilha)', pw / 2, y, { align: 'center' });
    y += 4;

    // ========== SEÇÃO 2 - DADOS DO INVENTÁRIO ==========
    y = sectionHeader(y, '2. DADOS DO INVENTÁRIO/ SOBREPARTILHA - TIPO');

    const tipoInv = caso.tipo_inventario || 'extrajudicial';
    const tipoProc = caso.tipo_processo || 'inventario';
    const isExtInv = tipoInv === 'extrajudicial' && tipoProc === 'inventario';
    const isExtSob = tipoInv === 'extrajudicial' && tipoProc === 'sobrepartilha';
    const isJudInv = tipoInv === 'judicial' && tipoProc === 'inventario';
    const isJudSob = tipoInv === 'judicial' && tipoProc === 'sobrepartilha';

    const halfW = cw / 2;
    const rowH = 5;

    // Row: Inventário Extrajudicial | Sobrepartilha Extrajudicial
    cell(ml, y, halfW, rowH, `( ${isExtInv ? 'X' : '  '} )  Inventário Extrajudicial`, { fontSize: 7 });
    cell(ml + halfW, y, halfW, rowH, `( ${isExtSob ? 'X' : '  '} )  Sobrepartilha Extrajudicial`, { fontSize: 7 });
    y += rowH;

    // Data de Abertura do Inventário
    cell(ml, y, halfW, rowH, `     Data de Abertura do Inventário: ${isExtInv ? fmtDate(caso.data_abertura_inventario) : ''}`, { fontSize: 6.5 });
    cell(ml + halfW, y, halfW, rowH, '', { fontSize: 6.5 });
    y += rowH;

    // Row: Inventário Judicial | Sobrepartilha Judicial
    cell(ml, y, halfW, rowH, `( ${isJudInv ? 'X' : '  '} )  Inventário Judicial`, { fontSize: 7 });
    cell(ml + halfW, y, halfW, rowH, `( ${isJudSob ? 'X' : '  '} )  Sobrepartilha Judicial`, { fontSize: 7 });
    y += rowH;

    // Judicial fields left
    const jfH = 4.5;
    cell(ml, y, halfW, jfH, `     Data de Distribuição: ${isJudInv ? fmtDate(caso.data_distribuicao) : ''}`, { fontSize: 6.5 });
    cell(ml + halfW, y, halfW, jfH, `     Processo de Sobrepartilha nº: ${isJudSob ? (caso.numero_sobrepartilha || '') : ''}`, { fontSize: 6.5 });
    y += jfH;
    cell(ml, y, halfW, jfH, `     Processo nº: ${isJudInv ? (caso.numero_processo_judicial || '') : ''}`, { fontSize: 6.5 });
    cell(ml + halfW, y, halfW, jfH, `     Vara/ Comarca: ${isJudSob ? (caso.vara_comarca_sobrepartilha || '') : ''}`, { fontSize: 6.5 });
    y += jfH;
    cell(ml, y, halfW, jfH, `     Vara/ Comarca: ${isJudInv ? (caso.vara_comarca || '') : ''}`, { fontSize: 6.5 });
    cell(ml + halfW, y, halfW, jfH, `     Data Homologação da Sobrepartilha: ${isJudSob ? fmtDate(caso.data_homologacao_sobrepartilha) : ''}`, { fontSize: 6.5 });
    y += jfH;
    cell(ml, y, halfW, jfH, `     Data Homologação da Partilha: ${isJudInv ? fmtDate(caso.data_homologacao_partilha) : ''}`, { fontSize: 6.5 });
    cell(ml + halfW, y, halfW, jfH, `     Data do Trânsito em Julgado: ${isJudSob ? fmtDate(caso.data_transito_julgado_sobrepartilha) : ''}`, { fontSize: 6.5 });
    y += jfH;
    cell(ml, y, halfW, jfH, `     Data do Trânsito em Julgado: ${isJudInv ? fmtDate(caso.data_transito_julgado) : ''}`, { fontSize: 6.5 });
    cell(ml + halfW, y, halfW, jfH, '', { fontSize: 6.5 });
    y += jfH;

    // ========== SEÇÃO 3 - IDENTIFICAÇÃO DAS PARTES ==========
    y = sectionHeader(y, '3. IDENTIFICAÇÃO DAS PARTES');

    // 3.1 INVENTARIADO(A) sub-header
    cell(ml, y, cw, 5, '3.1. INVENTARIADO(A)', { bold: true, fontSize: 7 });
    y += 5;

    // Nome | CPF
    const nameW = cw * 0.7;
    const cpfW = cw * 0.3;
    cell(ml, y, nameW, rowH, `Nome: ${caso.nome_falecido || ''}`, { fontSize: 7 });
    cell(ml + nameW, y, cpfW, rowH, `CPF: ${caso.cpf_falecido || ''}`, { fontSize: 7 });
    y += rowH;

    // Data óbito | Estado Civil | Regime | Data Casamento
    const qW = cw / 4;
    cell(ml, y, qW, rowH, `Data do óbito: ${fmtDate(caso.data_obito)}`, { fontSize: 6.5 });
    cell(ml + qW, y, qW, rowH, `Estado Civil: ${ESTADO_CIVIL_LABELS[caso.estado_civil] || ''}`, { fontSize: 6.5 });
    cell(ml + qW * 2, y, qW, rowH, `Regime de bens: ${REGIME_LABELS[caso.regime_bens] || ''}`, { fontSize: 6.5 });
    cell(ml + qW * 3, y, qW, rowH, `Data Casamento/ União estável: ${fmtDate(caso.data_casamento)}`, { fontSize: 6.5 });
    y += rowH;

    // 3.2 INVENTARIANTE sub-header
    cell(ml, y, cw, 5, '3.2. INVENTARIANTE', { bold: true, fontSize: 7 });
    y += 5;

    cell(ml, y, nameW, rowH, `Nome: ${inventariante?.nome || ''}`, { fontSize: 7 });
    cell(ml + nameW, y, cpfW, rowH, `CPF: ${inventariante?.cpf_cnpj || ''}`, { fontSize: 7 });
    y += rowH;

    cell(ml, y, nameW, rowH, `Endereço completo: ${inventariante?.endereco || ''}`, { fontSize: 7 });
    cell(ml + nameW, y, cpfW, rowH, `Telefone/ E-mail: ${inventariante?.telefone || ''} ${inventariante?.email || ''}`, { fontSize: 6.5 });
    y += rowH;

    // ========== SEÇÃO 4 - BENS ==========
    checkPage(25);
    y = sectionHeader(y, '4. BEM (NS)/ DIREITO(S)');

    // Table header
    const bColW = [12, 68, 38, 32, 40];
    const bColX = [ml];
    for (let i = 1; i < bColW.length; i++) bColX.push(bColX[i - 1] + bColW[i - 1]);

    const bHeaders = ['Item', 'Descrição Detalhada', 'Matrícula de Registro\n(Bem Imóvel)', 'Inscrição Municipal/\nINCRA\n(Bem Imóvel)', 'Valor (R$)'];
    const bhH = 8;
    bHeaders.forEach((h, i) => {
      cell(bColX[i], y, bColW[i], bhH, h, { bold: true, fontSize: 6, align: 'center' });
    });
    y += bhH;

    // Rows
    if (bens.length === 0) {
      bColW.forEach((w, i) => cell(bColX[i], y, w, rowH, i === 1 ? 'Nenhum bem declarado' : '', { fontSize: 6.5 }));
      y += rowH;
    } else {
      bens.forEach((bem, idx) => {
        checkPage(6);
        const rH = 5.5;
        cell(bColX[0], y, bColW[0], rH, `${idx + 1}`, { fontSize: 6.5, align: 'center' });
        cell(bColX[1], y, bColW[1], rH, (bem.descricao || '').substring(0, 55), { fontSize: 6.5 });
        cell(bColX[2], y, bColW[2], rH, (bem.tipo === 'imovel' || bem.tipo === 'casa' || bem.tipo === 'terreno') ? (bem.identificacao || '') : '', { fontSize: 6.5, align: 'center' });
        cell(bColX[3], y, bColW[3], rH, '', { fontSize: 6.5, align: 'center' });
        cell(bColX[4], y, bColW[4], rH, `R$ ${fmt(bem.valor)}`, { fontSize: 6.5, align: 'right' });
        y += rH;
      });
    }

    // Total bens
    const totalBens = bens.reduce((s, b) => s + (b.valor || 0), 0);
    cell(ml, y, cw - 40, 5, '', { fontSize: 6.5 });
    cell(ml + cw - 40, y, 40, 5, `Total: R$ ${fmt(totalBens)}`, { bold: true, fontSize: 6.5, align: 'right' });
    y += 5;

    // ========== SEÇÃO 5 - DÍVIDAS ==========
    checkPage(20);
    y = sectionHeader(y, '5. DÍVIDA(S) DO ESPÓLIO');

    const dColW = [12, 128, 50];
    const dColX = [ml, ml + 12, ml + 140];
    const dHeaders = ['Item', 'Descrição Detalhada', 'Valor (R$)'];
    dHeaders.forEach((h, i) => {
      cell(dColX[i], y, dColW[i], 6, h, { bold: true, fontSize: 6.5, align: 'center' });
    });
    y += 6;

    if (dividas.length === 0) {
      cell(ml, y, cw, rowH, '   Nenhuma dívida declarada.', { fontSize: 6.5 });
      y += rowH;
    } else {
      dividas.forEach((d, idx) => {
        checkPage(6);
        cell(dColX[0], y, dColW[0], 5, `${idx + 1}`, { fontSize: 6.5, align: 'center' });
        cell(dColX[1], y, dColW[1], 5, (d.titulo || d.descricao || '').substring(0, 90), { fontSize: 6.5 });
        cell(dColX[2], y, dColW[2], 5, `R$ ${fmt(d.valor)}`, { fontSize: 6.5, align: 'right' });
        y += 5;
      });
    }

    // ========== SEÇÃO 6 - CESSÃO ==========
    checkPage(14);
    y = sectionHeader(y, '6. CESSÃO DE DIREITOS HEREDITÁRIOS (Se houver) - TIPO');

    const cessao = caso.cessao_direitos || 'nenhuma';
    cell(ml, y, halfW, rowH, `( ${cessao === 'onerosa' ? 'X' : '  '} )    Onerosa`, { fontSize: 7 });
    cell(ml + halfW, y, halfW, rowH, `( ${cessao === 'nao_onerosa' ? 'X' : '  '} )    Não Onerosa`, { fontSize: 7 });
    y += rowH;

    // ========== SEÇÃO 7 - RENÚNCIA ==========
    y = sectionHeader(y, '7. RENÚNCIA ABDICATIVA EM FAVOR DO MONTE MOR (Se houver) - TIPO');

    const renuncia = caso.renuncia_abdicativa || 'nenhuma';
    cell(ml, y, halfW, rowH, `( ${renuncia === 'termo_judicial' ? 'X' : '  '} )    Por Termo Judicial`, { fontSize: 7 });
    cell(ml + halfW, y, halfW, rowH, `( ${renuncia === 'escritura_publica' ? 'X' : '  '} )    Por Escritura Pública`, { fontSize: 7 });
    y += rowH;

    // ========== SEÇÃO 8 - PARTILHA ==========
    checkPage(30);
    y = sectionHeader(y, '8. PARTILHA');

    const pColW = [45, 30, 35, 35, 45];
    const pColX = [ml];
    for (let i = 1; i < pColW.length; i++) pColX.push(pColX[i - 1] + pColW[i - 1]);

    const pHeaders = ['Meeiro(a)/ Herdeiro(a)\n(Nome e Condição)', 'Percentual ou Fração\ndo(s) Bem(ns)/ Direito(s)', 'Meação/ Quinhão Real\n(R$)', 'Meação/ Quinhão Legal\n(R$)', 'Excedente de Meação/\nQuinhão\n(R$)'];
    const phH = 9;
    pHeaders.forEach((h, i) => {
      cell(pColX[i], y, pColW[i], phH, h, { bold: true, fontSize: 5.5, align: 'center' });
    });
    y += phH;

    // Cônjuge meeiro
    if (caso.conjuge_nome && ((caso.valor_meacao_conjuge || 0) > 0 || (caso.valor_heranca_conjuge || 0) > 0)) {
      checkPage(6);
      const totalConj = (caso.valor_meacao_conjuge || 0) + (caso.valor_heranca_conjuge || 0);
      const percConj = caso.valor_patrimonio > 0 ? ((totalConj / caso.valor_patrimonio) * 100).toFixed(2) + '%' : '';
      cell(pColX[0], y, pColW[0], 5.5, `${caso.conjuge_nome} (Meeiro(a))`, { fontSize: 6 });
      cell(pColX[1], y, pColW[1], 5.5, percConj, { fontSize: 6, align: 'center' });
      cell(pColX[2], y, pColW[2], 5.5, `R$ ${fmt(caso.valor_meacao_conjuge)}`, { fontSize: 6, align: 'right' });
      cell(pColX[3], y, pColW[3], 5.5, `R$ ${fmt(caso.valor_heranca_conjuge)}`, { fontSize: 6, align: 'right' });
      cell(pColX[4], y, pColW[4], 5.5, 'R$ 0,00', { fontSize: 6, align: 'right' });
      y += 5.5;
    }

    // Herdeiros
    herdeiros.filter(h => h.parentesco !== 'conjuge').forEach(h => {
      checkPage(6);
      const cond = h.parentesco ? h.parentesco.charAt(0).toUpperCase() + h.parentesco.slice(1) : '';
      cell(pColX[0], y, pColW[0], 5.5, `${h.nome} (${cond})`, { fontSize: 6 });
      cell(pColX[1], y, pColW[1], 5.5, h.fracao_bens || `${(h.percentual_partilha || 0).toFixed(2)}%`, { fontSize: 6, align: 'center' });
      cell(pColX[2], y, pColW[2], 5.5, `R$ ${fmt(h.valor_meacao_quinhao_real || h.valor_parte)}`, { fontSize: 6, align: 'right' });
      cell(pColX[3], y, pColW[3], 5.5, `R$ ${fmt(h.valor_meacao_quinhao_legal || h.valor_parte)}`, { fontSize: 6, align: 'right' });
      cell(pColX[4], y, pColW[4], 5.5, `R$ ${fmt(h.valor_excedente_meacao || 0)}`, { fontSize: 6, align: 'right' });
      y += 5.5;
    });

    // Empty row if no data
    if (!caso.conjuge_nome && herdeiros.length === 0) {
      pColW.forEach((w, i) => cell(pColX[i], y, w, 5.5, '', { fontSize: 6 }));
      y += 5.5;
    }

    // Nota
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    const notaText = 'Nota: Havendo divisão do acervo patrimonial, que resulte em "excedente" de meação ou de quinhão, decorrente de transmissão "não onerosa",';
    const notaText2 = 'providenciar o recolhimento do imposto "inter vivos" e preencher a DECLARAÇÃO DO ITCMD "INTER VIVOS I".';
    cell(ml, y, cw, 4, notaText, { bold: true, fontSize: 5.5 });
    y += 4;
    cell(ml, y, cw, 4, notaText2, { bold: true, fontSize: 5.5 });
    y += 4;

    // ========== SEÇÃO 9 - USO DO CARTÓRIO ==========
    checkPage(22);
    y = sectionHeader(y, '9. USO DO CARTÓRIO');

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(5.5);
    cell(ml, y, cw, 4, '(Campo de preenchimento obrigatório em se tratando de Inventário/ Sobrepartilha extrajudiciais)', { italic: true, fontSize: 5.5 });
    y += 4;

    const cCol3 = cw / 3;
    cell(ml, y, cCol3, rowH, `Cartório: ${caso.cartorio_nome || ''}`, { fontSize: 6.5 });
    cell(ml + cCol3, y, cCol3, rowH, `Município: ${caso.cartorio_municipio || ''}`, { fontSize: 6.5 });
    cell(ml + cCol3 * 2, y, cCol3, rowH, `Comarca: ${caso.cartorio_comarca || ''}`, { fontSize: 6.5 });
    y += rowH;

    cell(ml, y, cw * 0.65, 8, 'Assinatura e Carimbo do(a) Funcionário(a)', { fontSize: 6.5 });
    cell(ml + cw * 0.65, y, cw * 0.35, 8, 'Data', { fontSize: 6.5 });
    y += 8;

    // ========== SEÇÃO 10 - CÁLCULO DO IMPOSTO ==========
    checkPage(42);
    y = sectionHeader(y, '10. CÁLCULO DO IMPOSTO');

    const totalDividas = dividas.reduce((sum, d) => sum + (d.valor || 0), 0);
    const monteMor = caso.valor_patrimonio || 0;
    const meacaoLegal = caso.valor_meacao_conjuge || 0;
    const montePartivel = monteMor - totalDividas - meacaoLegal;
    const baseCalculo = montePartivel > 0 ? montePartivel : 0;
    const aliquota = caso.aliquota || 0;
    const principal = caso.valor_itcmd || 0;
    const atualizacao = caso.valor_atualizacao || 0;
    const multa = caso.valor_multa || 0;
    const juros = caso.valor_juros || 0;
    const desconto = caso.valor_desconto || 0;
    const totalPagar = principal + atualizacao + multa + juros - desconto;

    // Row 1: Data Vencimento | Monte Mor | Dívida Espólio | Meação Conjugal Legal | Monte Partível
    const cW5 = cw / 5;
    cell(ml, y, cW5, 4, 'Data de Vencimento', { bold: true, fontSize: 5.5, align: 'center' });
    cell(ml + cW5, y, cW5, 4, 'Monte Mor', { bold: true, fontSize: 5.5, align: 'center' });
    cell(ml + cW5 * 2, y, cW5, 4, 'Dívida do Espólio', { bold: true, fontSize: 5.5, align: 'center' });
    cell(ml + cW5 * 3, y, cW5, 4, 'Meação Conjugal Legal', { bold: true, fontSize: 5.5, align: 'center' });
    cell(ml + cW5 * 4, y, cW5, 4, 'Monte Partível', { bold: true, fontSize: 5.5, align: 'center' });
    y += 4;

    cell(ml, y, cW5, 5, guia ? fmtDate(guia.data_vencimento) : '', { fontSize: 6.5, align: 'center' });
    cell(ml + cW5, y, cW5, 5, `R$ ${fmt(monteMor)}`, { fontSize: 6.5, align: 'center' });
    cell(ml + cW5 * 2, y, cW5, 5, `R$ ${fmt(totalDividas)}`, { fontSize: 6.5, align: 'center' });
    cell(ml + cW5 * 3, y, cW5, 5, `R$ ${fmt(meacaoLegal)}`, { fontSize: 6.5, align: 'center' });
    cell(ml + cW5 * 4, y, cW5, 5, `R$ ${fmt(montePartivel)}`, { fontSize: 6.5, align: 'center' });
    y += 5;

    // Row 2: Base Cálculo | Alíquota | Principal | Atualização | Multa | Juros
    const cW6 = cw / 6;
    cell(ml, y, cW6, 4, 'Base de Cálculo (total do Estado\nde SE) R$', { bold: true, fontSize: 5, align: 'center' });
    cell(ml + cW6, y, cW6 * 0.6, 4, 'Alíquota (%)', { bold: true, fontSize: 5.5, align: 'center' });
    cell(ml + cW6 + cW6 * 0.6, y, cW6 * 1.1, 4, 'Principal R$', { bold: true, fontSize: 5.5, align: 'center' });
    cell(ml + cW6 + cW6 * 0.6 + cW6 * 1.1, y, cW6 * 0.9, 4, 'Atualização R$', { bold: true, fontSize: 5.5, align: 'center' });
    cell(ml + cW6 + cW6 * 0.6 + cW6 * 1.1 + cW6 * 0.9, y, cW6 * 0.8, 4, 'Multa R$', { bold: true, fontSize: 5.5, align: 'center' });
    cell(ml + cW6 + cW6 * 0.6 + cW6 * 1.1 + cW6 * 0.9 + cW6 * 0.8, y, cW6 * 0.6, 4, 'Juros R$', { bold: true, fontSize: 5.5, align: 'center' });
    y += 4;

    cell(ml, y, cW6, 5, `R$ ${fmt(baseCalculo)}`, { fontSize: 6.5, align: 'center' });
    cell(ml + cW6, y, cW6 * 0.6, 5, `${aliquota}%`, { fontSize: 6.5, align: 'center' });
    cell(ml + cW6 + cW6 * 0.6, y, cW6 * 1.1, 5, `R$ ${fmt(principal)}`, { fontSize: 6.5, align: 'center' });
    cell(ml + cW6 + cW6 * 0.6 + cW6 * 1.1, y, cW6 * 0.9, 5, `R$ ${fmt(atualizacao)}`, { fontSize: 6.5, align: 'center' });
    cell(ml + cW6 + cW6 * 0.6 + cW6 * 1.1 + cW6 * 0.9, y, cW6 * 0.8, 5, `R$ ${fmt(multa)}`, { fontSize: 6.5, align: 'center' });
    cell(ml + cW6 + cW6 * 0.6 + cW6 * 1.1 + cW6 * 0.9 + cW6 * 0.8, y, cW6 * 0.6, 5, `R$ ${fmt(juros)}`, { fontSize: 6.5, align: 'center' });
    y += 5;

    // Row 3: Desconto | Total a Pagar | Data Pgto DAE | Nº DAE
    cell(ml, y, cW5, 4, 'Desconto R$', { bold: true, fontSize: 5.5, align: 'center' });
    cell(ml + cW5, y, cW5, 4, 'Total a Pagar R$', { bold: true, fontSize: 5.5, align: 'center' });
    cell(ml + cW5 * 2, y, cW5, 4, 'Data de Pagamento do DAE', { bold: true, fontSize: 5.5, align: 'center' });
    cell(ml + cW5 * 3, y, cW5, 4, 'Nº do DAE', { bold: true, fontSize: 5.5, align: 'center' });
    cell(ml + cW5 * 4, y, cW5, 4, '', { fontSize: 5.5 });
    y += 4;

    cell(ml, y, cW5, 5, `R$ ${fmt(desconto)}`, { fontSize: 6.5, align: 'center' });
    cell(ml + cW5, y, cW5, 5, `R$ ${fmt(totalPagar)}`, { bold: true, fontSize: 6.5, align: 'center' });
    cell(ml + cW5 * 2, y, cW5, 5, guia ? fmtDate(guia.data_pagamento) : '', { fontSize: 6.5, align: 'center' });
    cell(ml + cW5 * 3, y, cW5, 5, guia?.numero_guia || '', { fontSize: 6.5, align: 'center' });
    cell(ml + cW5 * 4, y, cW5, 5, '', { fontSize: 6.5 });
    y += 5;

    // Row 4: Nº Parcelamento | Base Legal
    cell(ml, y, cW5 * 2, 5, 'Nº do Parcelamento:', { fontSize: 6.5 });
    cell(ml + cW5 * 2, y, cW5 * 3, 5, `Base Legal se houver isenção ou imunidade: ${caso.base_legal_isencao || ''}`, { fontSize: 6.5 });
    y += 5;

    // ========== SEÇÃO 11 - RESPONSÁVEL ==========
    checkPage(18);
    y = sectionHeader(y, '11. RESPONSÁVEL');

    const hoje = new Date().toLocaleDateString('pt-BR');
    const rColW4 = cw / 4;
    cell(ml, y, rColW4, 4, 'Local/ Data', { bold: true, fontSize: 6, align: 'center' });
    cell(ml + rColW4, y, rColW4, 4, 'Nome completo', { bold: true, fontSize: 6, align: 'center' });
    cell(ml + rColW4 * 2, y, rColW4, 4, 'CPF', { bold: true, fontSize: 6, align: 'center' });
    cell(ml + rColW4 * 3, y, rColW4, 4, 'Assinatura', { bold: true, fontSize: 6, align: 'center' });
    y += 4;

    cell(ml, y, rColW4, 7, `${caso.cartorio_municipio || 'Aracaju'}, ${hoje}`, { fontSize: 6.5, align: 'center' });
    cell(ml + rColW4, y, rColW4, 7, inventariante?.nome || user.full_name || '', { fontSize: 6.5, align: 'center' });
    cell(ml + rColW4 * 2, y, rColW4, 7, inventariante?.cpf_cnpj || '', { fontSize: 6.5, align: 'center' });
    cell(ml + rColW4 * 3, y, rColW4, 7, '', { fontSize: 6.5 });
    y += 7;

    // ========== SEÇÃO 12 - RECEPÇÃO DA DECLARAÇÃO ==========
    checkPage(28);
    y = sectionHeader(y, '12. RECEPÇÃO DA DECLARAÇÃO (Uso da SEFAZ)');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    cell(ml, y, cw, 4, 'Documentação recepcionada para posterior análise e fiscalização.', { bold: true, fontSize: 5.5 });
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    const recText = 'A Secretaria de Estado da Fazenda reserva-se o Direito de exigir eventuais diferenças do imposto em relação ao período declarado, no prazo decadencial';
    const recText2 = 'para a constituição do crédito tributário, nos termos do art.173 da Lei nº 5.172, de 25/10/1966 (Código Tributário Nacional).';
    cell(ml, y, cw, 3.5, recText, { fontSize: 5 });
    y += 3.5;
    cell(ml, y, cw, 3.5, recText2, { fontSize: 5 });
    y += 3.5;

    cell(ml, y, cw * 0.65, 8, 'Assinatura do(a) Funcionário(a)', { fontSize: 6.5 });
    cell(ml + cw * 0.65, y, cw * 0.35, 8, 'Data', { fontSize: 6.5 });
    y += 8;

    // Footer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6);
    doc.text('Impresso em 3 vias', pw - mr, ph - 5, { align: 'right' });

    const pdfBytes = doc.output('arraybuffer');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=Declaracao_ITCMD_${caso.numero_caso || caso.id}.pdf`
      }
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});