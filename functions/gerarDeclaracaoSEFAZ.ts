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

    // Buscar todos os dados
    const casos = await base44.entities.Caso.filter({ id: caso_id });
    const caso = casos[0];
    if (!caso) {
      return Response.json({ error: 'Caso não encontrado' }, { status: 404 });
    }

    const herdeiros = await base44.entities.Herdeiro.filter({ caso_id });
    const bens = await base44.entities.Bem.filter({ caso_id });
    const dividas = await base44.entities.Divida.filter({ caso_id });
    const inventariantes = await base44.entities.Inventariante.filter({ caso_id });
    const inventariante = inventariantes[0];

    // Criar PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const addNewPageIfNeeded = (needed) => {
      if (y + needed > 280) {
        doc.addPage();
        y = margin;
        return true;
      }
      return false;
    };

    // ============ CABEÇALHO ============
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Governo de Sergipe', margin, y);
    y += 4;
    doc.text('Secretaria de Estado da Fazenda', margin, y);
    y += 4;
    doc.text('Coordenadoria do ITCMD', margin, y);

    // Número da declaração (canto direito)
    doc.setFontSize(8);
    doc.rect(pageWidth - margin - 55, margin - 5, 55, 15);
    doc.text('1. Nº da Declaração do ITCMD', pageWidth - margin - 53, margin);
    doc.text('(Uso da SEFAZ)', pageWidth - margin - 53, margin + 4);

    y += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DECLARAÇÃO DO ITCMD "CAUSA MORTIS"', pageWidth / 2, y, { align: 'center' });
    y += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('(Inventário / Sobrepartilha)', pageWidth / 2, y, { align: 'center' });
    y += 8;

    // ============ SEÇÃO 2 - DADOS DO INVENTÁRIO ============
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('2. DADOS DO INVENTÁRIO / SOBREPARTILHA - TIPO', margin + 2, y + 4);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    const tipoInv = caso.tipo_inventario || 'extrajudicial';
    const tipoProc = caso.tipo_processo || 'inventario';

    // Inventário Extrajudicial
    const extrajudicial = tipoInv === 'extrajudicial' && tipoProc === 'inventario';
    doc.text(`( ${extrajudicial ? 'X' : ' '} ) Inventário Extrajudicial`, margin + 2, y);
    doc.text(`( ${tipoInv === 'extrajudicial' && tipoProc === 'sobrepartilha' ? 'X' : ' '} ) Sobrepartilha Extrajudicial`, margin + contentWidth / 2, y);
    y += 5;

    if (extrajudicial && caso.data_abertura_inventario) {
      doc.text(`Data de Abertura do Inventário: ${fmtDate(caso.data_abertura_inventario)}`, margin + 5, y);
      y += 5;
    }

    // Inventário Judicial
    const judicial = tipoInv === 'judicial' && tipoProc === 'inventario';
    doc.text(`( ${judicial ? 'X' : ' '} ) Inventário Judicial`, margin + 2, y);
    doc.text(`( ${tipoInv === 'judicial' && tipoProc === 'sobrepartilha' ? 'X' : ' '} ) Sobrepartilha Judicial`, margin + contentWidth / 2, y);
    y += 5;

    if (judicial) {
      if (caso.data_distribuicao) doc.text(`Data de Distribuição: ${fmtDate(caso.data_distribuicao)}`, margin + 5, y);
      y += 4;
      if (caso.numero_processo_judicial) doc.text(`Processo nº: ${caso.numero_processo_judicial}`, margin + 5, y);
      y += 4;
      if (caso.vara_comarca) doc.text(`Vara/Comarca: ${caso.vara_comarca}`, margin + 5, y);
      y += 4;
      if (caso.data_homologacao_partilha) doc.text(`Data Homologação da Partilha: ${fmtDate(caso.data_homologacao_partilha)}`, margin + 5, y);
      y += 4;
      if (caso.data_transito_julgado) doc.text(`Data do Trânsito em Julgado: ${fmtDate(caso.data_transito_julgado)}`, margin + 5, y);
      y += 4;
    }

    y += 3;
    doc.setDrawColor(150);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    // ============ SEÇÃO 3 - IDENTIFICAÇÃO DAS PARTES ============
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('3. IDENTIFICAÇÃO DAS PARTES', margin + 2, y + 4);
    y += 9;

    // 3.1 Inventariado
    doc.setFont('helvetica', 'bold');
    doc.text('3.1. INVENTARIADO(A)', margin + 2, y);
    y += 5;
    doc.setFont('helvetica', 'normal');

    doc.text(`Nome: ${caso.nome_falecido || ''}`, margin + 2, y);
    doc.text(`CPF: ${caso.cpf_falecido || ''}`, margin + contentWidth * 0.7, y);
    y += 5;
    doc.text(`Data do óbito: ${fmtDate(caso.data_obito)}`, margin + 2, y);
    doc.text(`Estado Civil: ${ESTADO_CIVIL_LABELS[caso.estado_civil] || caso.estado_civil || ''}`, margin + 50, y);
    y += 5;
    doc.text(`Regime de bens: ${REGIME_LABELS[caso.regime_bens] || ''}`, margin + 2, y);
    doc.text(`Data Casamento/União estável: ${fmtDate(caso.data_casamento)}`, margin + contentWidth * 0.5, y);
    y += 7;

    // 3.2 Inventariante
    doc.setFont('helvetica', 'bold');
    doc.text('3.2. INVENTARIANTE', margin + 2, y);
    y += 5;
    doc.setFont('helvetica', 'normal');

    doc.text(`Nome: ${inventariante?.nome || ''}`, margin + 2, y);
    doc.text(`CPF: ${inventariante?.cpf_cnpj || ''}`, margin + contentWidth * 0.7, y);
    y += 5;
    doc.text(`Endereço completo: ${inventariante?.endereco || ''}`, margin + 2, y);
    y += 5;
    doc.text(`Telefone/E-mail: ${inventariante?.telefone || ''} / ${inventariante?.email || ''}`, margin + 2, y);
    y += 7;

    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    // ============ SEÇÃO 4 - BENS ============
    addNewPageIfNeeded(30);
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('4. BEM(NS) / DIREITO(S)', margin + 2, y + 4);
    y += 9;

    // Cabeçalho da tabela
    const colBens = [margin, margin + 10, margin + 80, margin + 120, margin + 150];
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', colBens[0], y);
    doc.text('Descrição Detalhada', colBens[1], y);
    doc.text('Matrícula de Registro', colBens[2], y);
    doc.text('Inscrição Municipal', colBens[3], y);
    doc.text('Valor (R$)', colBens[4], y);
    y += 2;
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    bens.forEach((bem, idx) => {
      addNewPageIfNeeded(8);
      doc.text(`${idx + 1}`, colBens[0], y);
      
      // Truncar descrição se muito longa
      const descricao = (bem.descricao || '').substring(0, 50);
      doc.text(descricao, colBens[1], y);
      doc.text(bem.tipo === 'imovel' ? (bem.identificacao || '') : '', colBens[2], y);
      doc.text('', colBens[3], y);
      doc.text(`R$ ${fmt(bem.valor)}`, colBens[4], y);
      y += 5;
    });

    y += 3;
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    // ============ SEÇÃO 5 - DÍVIDAS ============
    addNewPageIfNeeded(20);
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('5. DÍVIDA(S) DO ESPÓLIO', margin + 2, y + 4);
    y += 9;

    doc.setFontSize(7);
    doc.text('Item', margin, y);
    doc.text('Descrição Detalhada', margin + 10, y);
    doc.text('Valor (R$)', margin + 150, y);
    y += 2;
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    if (dividas.length === 0) {
      doc.text('Nenhuma dívida declarada.', margin + 10, y);
      y += 5;
    } else {
      dividas.forEach((divida, idx) => {
        addNewPageIfNeeded(8);
        doc.text(`${idx + 1}`, margin, y);
        doc.text((divida.titulo || divida.descricao || '').substring(0, 80), margin + 10, y);
        doc.text(`R$ ${fmt(divida.valor)}`, margin + 150, y);
        y += 5;
      });
    }

    y += 3;
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    // ============ SEÇÃO 6 - CESSÃO DE DIREITOS ============
    addNewPageIfNeeded(15);
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('6. CESSÃO DE DIREITOS HEREDITÁRIOS (Se houver) - TIPO', margin + 2, y + 4);
    y += 9;

    doc.setFont('helvetica', 'normal');
    const cessao = caso.cessao_direitos || 'nenhuma';
    doc.text(`( ${cessao === 'onerosa' ? 'X' : ' '} ) Onerosa`, margin + 10, y);
    doc.text(`( ${cessao === 'nao_onerosa' ? 'X' : ' '} ) Não Onerosa`, margin + 80, y);
    y += 7;

    // ============ SEÇÃO 7 - RENÚNCIA ============
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('7. RENÚNCIA ABDICATIVA EM FAVOR DO MONTE MOR (Se houver) - TIPO', margin + 2, y + 4);
    y += 9;

    doc.setFont('helvetica', 'normal');
    const renuncia = caso.renuncia_abdicativa || 'nenhuma';
    doc.text(`( ${renuncia === 'termo_judicial' ? 'X' : ' '} ) Por Termo Judicial`, margin + 10, y);
    doc.text(`( ${renuncia === 'escritura_publica' ? 'X' : ' '} ) Por Escritura Pública`, margin + 80, y);
    y += 7;

    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    // ============ SEÇÃO 8 - PARTILHA ============
    addNewPageIfNeeded(40);
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('8. PARTILHA', margin + 2, y + 4);
    y += 9;

    // Cabeçalho da tabela
    const colPart = [margin, margin + 50, margin + 85, margin + 115, margin + 150];
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Meeiro(a)/Herdeiro(a)', colPart[0], y);
    doc.text('% ou Fração', colPart[1], y);
    doc.text('Meação/Quinhão Real', colPart[2], y);
    doc.text('Meação/Quinhão Legal', colPart[3], y);
    doc.text('Excedente', colPart[4], y);
    y += 2;
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    // Cônjuge meeiro (se houver meação)
    if (caso.conjuge_nome && (caso.valor_meacao_conjuge > 0 || caso.valor_heranca_conjuge > 0)) {
      addNewPageIfNeeded(8);
      doc.text(`${caso.conjuge_nome} (Meeiro/Herdeiro)`, colPart[0], y);
      const totalConjuge = (caso.valor_meacao_conjuge || 0) + (caso.valor_heranca_conjuge || 0);
      const percConjuge = caso.valor_patrimonio > 0 ? ((totalConjuge / caso.valor_patrimonio) * 100).toFixed(2) + '%' : '';
      doc.text(percConjuge, colPart[1], y);
      doc.text(`R$ ${fmt(caso.valor_meacao_conjuge)}`, colPart[2], y);
      doc.text(`R$ ${fmt(caso.valor_heranca_conjuge)}`, colPart[3], y);
      doc.text('R$ 0,00', colPart[4], y);
      y += 5;
    }

    // Herdeiros
    herdeiros.filter(h => h.parentesco !== 'conjuge').forEach(h => {
      addNewPageIfNeeded(8);
      const condicao = h.parentesco ? h.parentesco.charAt(0).toUpperCase() + h.parentesco.slice(1) : '';
      doc.text(`${h.nome} (${condicao})`, colPart[0], y);
      doc.text(h.fracao_bens || `${(h.percentual_partilha || 0).toFixed(2)}%`, colPart[1], y);
      doc.text(`R$ ${fmt(h.valor_meacao_quinhao_real || h.valor_parte)}`, colPart[2], y);
      doc.text(`R$ ${fmt(h.valor_meacao_quinhao_legal || h.valor_parte)}`, colPart[3], y);
      doc.text(`R$ ${fmt(h.valor_excedente_meacao || 0)}`, colPart[4], y);
      y += 5;
    });

    y += 3;
    doc.setFontSize(6);
    doc.setFont('helvetica', 'italic');
    doc.text('Nota: Havendo divisão do acervo patrimonial, que resulte em "excedente" de meação ou de quinhão,', margin, y);
    y += 3;
    doc.text('decorrente de transmissão "não onerosa", providenciar o recolhimento do imposto "inter vivos".', margin, y);
    y += 5;

    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    // ============ SEÇÃO 9 - USO DO CARTÓRIO ============
    addNewPageIfNeeded(25);
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('9. USO DO CARTÓRIO (obrigatório para inventários extrajudiciais)', margin + 2, y + 4);
    y += 9;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`Cartório: ${caso.cartorio_nome || ''}`, margin + 2, y);
    doc.text(`Município: ${caso.cartorio_municipio || ''}`, margin + 80, y);
    doc.text(`Comarca: ${caso.cartorio_comarca || ''}`, margin + 140, y);
    y += 8;
    doc.text('Assinatura e Carimbo do(a) Funcionário(a):', margin + 2, y);
    doc.text('Data: ____/____/________', margin + 130, y);
    y += 7;

    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    // ============ SEÇÃO 10 - CÁLCULO DO IMPOSTO ============
    addNewPageIfNeeded(45);
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('10. CÁLCULO DO IMPOSTO', margin + 2, y + 4);
    y += 9;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    const totalDividas = dividas.reduce((sum, d) => sum + (d.valor || 0), 0);
    const monteMor = caso.valor_patrimonio || 0;
    const meacaoLegal = caso.valor_meacao_conjuge || 0;
    const montePartivel = monteMor - totalDividas - meacaoLegal;
    const baseCalculo = (caso.valor_heranca_conjuge || 0) + (caso.valor_heranca_filhos || 0);
    const principal = caso.valor_itcmd || 0;
    const atualizacao = caso.valor_atualizacao || 0;
    const multa = caso.valor_multa || 0;
    const juros = caso.valor_juros || 0;
    const desconto = caso.valor_desconto || 0;
    const totalPagar = principal + atualizacao + multa + juros - desconto;

    // Linha 1
    doc.text('Data de Vencimento:', margin + 2, y);
    doc.text(`Monte Mor: R$ ${fmt(monteMor)}`, margin + 45, y);
    doc.text(`Dívida do Espólio: R$ ${fmt(totalDividas)}`, margin + 90, y);
    doc.text(`Meação Conjugal Legal: R$ ${fmt(meacaoLegal)}`, margin + 135, y);
    y += 5;

    doc.text(`Monte Partível: R$ ${fmt(montePartivel)}`, margin + 2, y);
    y += 5;

    // Linha 2
    doc.text(`Base de Cálculo (total do Estado de SE): R$ ${fmt(baseCalculo)}`, margin + 2, y);
    doc.text(`Alíquota (%): ${caso.aliquota || 0}%`, margin + 90, y);
    doc.text(`Principal: R$ ${fmt(principal)}`, margin + 135, y);
    y += 5;

    doc.text(`Atualização: R$ ${fmt(atualizacao)}`, margin + 2, y);
    doc.text(`Multa: R$ ${fmt(multa)}`, margin + 50, y);
    doc.text(`Juros: R$ ${fmt(juros)}`, margin + 90, y);
    doc.text(`Desconto: R$ ${fmt(desconto)}`, margin + 135, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.text(`Total a Pagar: R$ ${fmt(totalPagar)}`, margin + 2, y);
    doc.setFont('helvetica', 'normal');
    y += 7;

    if (caso.base_legal_isencao) {
      doc.text(`Base Legal (isenção/imunidade): ${caso.base_legal_isencao}`, margin + 2, y);
      y += 5;
    }

    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    // ============ SEÇÃO 11 - RESPONSÁVEL ============
    addNewPageIfNeeded(20);
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('11. RESPONSÁVEL', margin + 2, y + 4);
    y += 9;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const hoje = new Date().toLocaleDateString('pt-BR');
    doc.text(`Local/Data: Aracaju, ${hoje}`, margin + 2, y);
    doc.text(`Nome completo: ${user.full_name || ''}`, margin + 70, y);
    y += 5;
    doc.text(`CPF: ___________________`, margin + 2, y);
    doc.text('Assinatura: ________________________________', margin + 70, y);
    y += 7;

    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    // ============ SEÇÃO 12 - RECEPÇÃO ============
    addNewPageIfNeeded(25);
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('12. RECEPÇÃO DA DECLARAÇÃO (Uso da SEFAZ)', margin + 2, y + 4);
    y += 9;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6);
    doc.text('Documentação recepcionada para posterior análise e fiscalização.', margin + 2, y);
    y += 4;
    doc.text('A Secretaria de Estado da Fazenda reserva-se o Direito de exigir eventuais diferenças do imposto', margin + 2, y);
    y += 3;
    doc.text('em relação ao período declarado, no prazo decadencial para a constituição do crédito tributário,', margin + 2, y);
    y += 3;
    doc.text('nos termos do art.173 da Lei nº 5.172, de 25/10/1966 (Código Tributário Nacional).', margin + 2, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Assinatura do(a) Funcionário(a): ________________________________', margin + 2, y);
    doc.text('Data: ____/____/________', margin + 130, y);
    y += 8;

    // Rodapé
    doc.setFontSize(7);
    doc.text('Impresso em 3 vias', pageWidth - margin - 25, 290);

    // Gerar PDF como bytes
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