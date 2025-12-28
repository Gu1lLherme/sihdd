import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Palette, Database, Layout, Code, Zap } from "lucide-react";

const sections = [
  {
    id: "overview",
    title: "Ideia e Funcionamento",
    icon: BookOpen,
    content: `
# Visão Geral do SIHDD

O SIHDD (Sistema Inteligente de Herança e Direito Sucessório) centraliza a gestão de inventários, doações e divórcios, com automações, cálculos tributários e portal do cliente.

## O que o sistema representa
- Uma plataforma de gestão de processos sucessórios e afins
- Padronização de rotinas, prazos e documentos
- Transparência: trilha de auditoria e portal para clientes

## Como funciona
- Entidades principais: Caso, Herdeiro, Bem, Divida, Inventariante, Task, CalendarEvent
- Fluxo guiado de Inventário: Dados Iniciais → Herdeiros → Inventariante → Bens → Dívidas → Resumo
- Cálculos automáticos: ITCMD total e por herdeiro
- Automação de tarefas e eventos de calendário ao nomear inventariante
- Integrações oficiais (catálogo) e registros em Auditoria
- Multi-tenant por Escritório (Office) e white‑label
    `
  },
  {
    id: "quickstart",
    title: "Guia Rápido (Caso de Uso)",
    icon: Zap,
    content: `
# Passo a passo – Novo Inventário

1. Dashboard → Novo Caso de Inventário
2. Dados Iniciais: informe falecido, óbito, cônjuge, endereço e regime de bens
3. Herdeiros: cadastre todos e defina os percentuais (devem somar 100%)
4. Inventariante: informe nome, CPF/CNPJ, e data de nomeação
5. Bens e Dívidas: adicione itens com valores e documentos (se houver)
6. Resumo: revise valores de patrimônio e ITCMD, então Salvar Caso
7. Tarefas/Calendário: acompanhe prazos gerados automaticamente
8. Guias: gere/registre a guia do ITCMD quando aplicável
9. Detalhe do Caso: monitore status até a conclusão

Dicas:
- Use o Calendário para prazos críticos (ITCMD em destaque)
- Utilize o Portal do Cliente para troca de documentos e atualizações
    `
  },
  {
    id: "design",
    title: "Design System",
    icon: Palette,
    content: `
# 🎨 DESIGN SYSTEM

## Paleta de Cores (Regra 60-30-10)

### 60% - Cores Neutras (Fundo)
- Branco Puro: #FFFFFF
- Cinza Gelo: #F5F5F5
- Cinza Claro: #AAAAAA
- Cinza Escuro: #333333

### 30% - Azul Royal (Identidade)
- Azul Royal Primário: #4169E1
- Azul Royal Hover: #3151c7

**Uso:** Logo, sidebar, botões principais, itens ativos, Tasks "Em Andamento", Audiências

### 10% - Dourado Ouro (Destaque Premium)
- Dourado Primário: #FFC107
- Dourado Hover: #e6ac00

**Uso:** Cards Premium (Patrimônio/ITCMD), valores financeiros, Prazo ITCMD, ML Predictions, Prioridade Alta

### Cores Complementares
- Verde Sucesso: #28A745 (Status positivos, botão Gerar Certidão)
- Vermelho Erro: #DC3545
- Laranja Alerta: #FD7E14

## Componentes UI

### Cards
- Background: #FFFFFF
- Border: 2px solid #E5E7EB
- Border-radius: 12-24px
- Shadow: 0 4px 6px rgba(0,0,0,0.1)
- Hover: transform translateY(-4px), shadow-xl

### Botões
- Primário: bg-#4169E1, texto branco
- Premium: bg-#FFC107, texto branco
- Sucesso: bg-#28A745, texto branco
- Outline: border-#4169E1, texto #4169E1
    `
  },
  {
    id: "entities",
    title: "Entidades",
    icon: Database,
    content: `
# 🗄️ ENTIDADES DO SISTEMA

## 1. Caso
Processo de inventário completo.

**Campos principais:**
- numero_caso: string (único)
- nome_falecido: string (obrigatório)
- cpf_falecido: string
- data_obito: date (obrigatório)
- valor_patrimonio: number (obrigatório)
- valor_itcmd: number (calculado)
- aliquota: number (padrão 4%)
- status: enum (7 opções)

**Status:**
coleta_dados → calculo_itcmd → geracao_dae → aguardando_pagamento → em_analise_sefaz → certidao_emitida → finalizado

## 2. Herdeiro
Cada herdeiro de um inventário.

**Campos:**
- caso_id: referência ao caso
- nome: string (obrigatório)
- parentesco: enum (conjuge, filho, pai, etc)
- percentual_partilha: 0-100 (obrigatório)
- valor_parte: number (calculado)
- valor_itcmd: number (calculado)

## 3. Bem
Bens do patrimônio.

**Tipos:** imovel, veiculo, conta_bancaria, investimento, empresa, outros
**Status validação:** pendente, validado, revisar

## 4. Task ⭐ NOVA
Gestão de tarefas.

**Prioridades:** baixa, media, alta, urgente
**Status:** pendente, em_andamento, concluida, cancelada
**Cores por status:**
- Pendente: border-slate-300
- Em Andamento: border-#4169E1
- Concluída: border-#28A745

## 5. CalendarEvent ⭐ NOVA
Eventos jurídicos.

**Tipos e Cores:**
- prazo_itcmd: DOURADO (#FFC107) - Premium
- audiencia: Azul Royal (#4169E1)
- reuniao: Azul Royal
- vencimento: Vermelho
- entrega_documento: Verde (#28A745)

## 6. Payment ⭐ NOVA
Gateway de pagamento.

**Métodos:** cartao_credito, pix, boleto, transferencia
**Gateways:** stripe, pagseguro, mercadopago
**Botão:** DOURADO (#FFC107) "Pagar ITCMD Online"

## 7. Signature ⭐ NOVA
Assinatura digital.

**Status:**
- Aguardando: DOURADO
- Assinado: Verde
- Parcial: Azul

## 8. Office ⭐ NOVA
Multi-tenant.

**White-label:** cores customizáveis por escritório
**Planos:** basico, profissional, enterprise

## 9. MLPrediction ⭐ NOVA
Machine Learning.

**Tipos:** prazo_conclusao, valor_itcmd, complexidade
**Visualização:** Cards DOURADOS com badge Premium
    `
  },
  {
    id: "pages",
    title: "Páginas",
    icon: Layout,
    content: `
# Rotas principais
- Dashboard, Inventários, Doações, Divórcios, Tasks, Calendário, Chat, Portal, Relatórios, Administração, Auditoria, Configurações
`
# 📄 PÁGINAS DO SISTEMA

## 1. Dashboard (/Dashboard)
**4 Stats Cards:**
- Total Casos / Casos Ativos (Azul)
- Patrimônio / ITCMD (DOURADO - Premium)

**3 Ações Rápidas:**
- Consultar IA RAG (Azul #4169E1)
- Gerar Certidão (Verde #28A745)
- Relatório Financeiro (DOURADO #FFC107)

**3 Gráficos:**
- Evolução Casos (BarChart azul)
- Distribuição Status (PieChart)
- ITCMD Coletado (LineChart DOURADO)

## 2. Tasks (/Tasks) ⭐
Gestão de tarefas com workflow visual.

**Cores:**
- Border por status (pendente/andamento/concluída)
- Badge prioridade (alta = dourado)
- Ícones contextuais

## 3. Calendar (/Calendar) ⭐
Calendário jurídico.

**Destaque:**
- Prazo ITCMD: DOURADO (#FFC107)
- Audiência: Azul Royal
- Entrega: Verde

## 4. Chat Assistente (/ChatAssistente)
IA RAG especializada em ITCMD/SE.

**Visual:**
- Header: gradiente azul
- Perguntas sugeridas
- Markdown formatado

## 5. Novo Caso (/NovoCaso)
Wizard 4 etapas:
1. Dados Básicos
2. Herdeiros
3. Bens
4. Resumo (PieChart)

## 6. Detalhe Caso (/DetalheCaso)
5 componentes:
- CasoHeader
- StatusTimeline
- HerdeirosList
- BensList
- GuiasDAE (botão dourado)

## 7. Inventários (/Inventarios)
Lista completa com filtros.

## 8. Integrações (/Integracoes)
SEFAZ, Cartório, DETRAN.
**Loading:** Pulse Glow azul

## 9. Portal Cliente (/PortalCliente)
4 tabs: Casos, Documentos, Chat, Notificações

## 10. Relatórios (/Relatorios)
Stats + Export CSV

## 11. Administração (/Administracao)
Gestão usuários (admin only)

## 12. Auditoria (/Auditoria)
Trilha completa + Export CSV

## 13. Configurações (/Configuracoes)
Conta, Módulos, Notificações
    `
  },
  {
    id: "components",
    title: "Componentes",
    icon: Code,
    content: `
# 🧩 COMPONENTES REUTILIZÁVEIS

## StatsCards
**Props:** title, value, icon, color, isPremium

**Visual:**
- Border: slate-200 ou #FFC107 (premium)
- Ícone em círculo colorido
- Valor: cor contextual, extrabold
- Badge "Premium" se isPremium
- Hover: scale + barra colorida

**Uso:**
\`\`\`jsx
<StatsCards 
  title="ITCMD Total"
  value="R$ 120k"
  icon={TrendingUp}
  color="#FFC107"
  isPremium={true}
/>
\`\`\`

## CasoCard
**Props:** caso object

**Visual:**
- Nome + badge status
- 2 sub-cards DOURADOS (patrimônio/ITCMD)
- Prazo com border azul
- Botão azul royal
- Hover: scale, sombra

## DashboardCharts
**Props:** casos array

**3 gráficos Recharts:**
1. BarChart: barras azul royal
2. PieChart: cores variadas
3. LineChart: linha DOURADA, border card dourada

## CasoHeader
Dados principais do caso, valores financeiros em destaque

## StatusTimeline
7 steps com cores:
- Completo: verde
- Current: azul + progress bar
- Pendente: cinza

## HerdeirosList / BensList
Grid 2 colunas, cards informativos

## GuiasDAE
Cards de pagamento com botão DOURADO
    `
  },
  {
    id: "features",
    title: "Funcionalidades",
    icon: Zap,
    content: `
# ⚙️ FUNCIONALIDADES PRINCIPAIS

## 1. CRUD Inventários
- Create: Wizard 4 etapas
- Read: Dashboard + lista + detalhe
- Validações: campos obrigatórios, percentuais

## 2. Cálculo ITCMD
\`\`\`javascript
valor_itcmd = patrimonio * (aliquota / 100)
\`\`\`
- Alíquota padrão: 4% (Sergipe)
- Distribuição por herdeiro
- Sempre em DOURADO

## 3. IA Jurídica RAG
\`\`\`javascript
const response = await base44.integrations.Core.InvokeLLM({
  prompt: "Especialista em ITCMD/SE...",
  add_context_from_internet: false
});
\`\`\`
- Legislação 2020-2025
- Markdown formatado
- Histórico persistido

## 4. Task Management ⭐
**Cores por Status:**
- Pendente: slate
- Em Andamento: AZUL ROYAL
- Concluída: VERDE

**Prioridade Alta:** DOURADO

## 5. Calendário Jurídico ⭐
**Prazo ITCMD:** SEMPRE DOURADO (#FFC107)
- Destaque premium financeiro
- Stats card dourado
- Cards dourados na lista

## 6. Payment Gateway ⭐
**Botão Pagar:**
- Background: DOURADO (#FFC107)
- Label: "Pagar ITCMD Online"
- Shadow-lg, hover scale

## 7. E-signature ⭐
**Status:**
- Aguardando: DOURADO
- Assinado: VERDE
- Botão: Azul Royal

## 8. Multi-tenant ⭐
- White-label configurável
- Cores por escritório
- Limites e planos

## 9. ML Predictions ⭐
- Cards DOURADOS
- Badge "Premium"
- Tipos: prazo, valor, complexidade

## 10. Integrações
- SEFAZ, Cartório, DETRAN
- Loading: Pulse Glow azul
- Status: badges coloridos

## 11. Auditoria
- Trilha completa de ações
- Exportação CSV
- Filtros avançados

## 12. Portal Cliente
- Casos próprios
- Upload documentos
- Chat seguro
- Notificações
    `
  }
];

export default function Documentacao() {
  const [activeSection, setActiveSection] = useState("design");

  const currentSection = sections.find(s => s.id === activeSection);
  const Icon = currentSection?.icon;

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#4169E1] rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#333333]">Documentação SIHDD</h1>
            <p className="text-sm text-[#AAAAAA]">Sistema Inteligente de Herança e Direito Sucessório</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-slate-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#4169E1] mb-1">14</p>
              <p className="text-xs font-bold text-[#AAAAAA] uppercase">Entidades</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-slate-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#4169E1] mb-1">13</p>
              <p className="text-xs font-bold text-[#AAAAAA] uppercase">Páginas</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-[#FFC107]">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#FFC107] mb-1">7</p>
              <p className="text-xs font-bold text-[#AAAAAA] uppercase">Avançadas</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-slate-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#28A745] mb-1">100%</p>
              <p className="text-xs font-bold text-[#AAAAAA] uppercase">Responsivo</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-slate-200 sticky top-4">
              <CardHeader className="bg-blue-50 border-b-2 border-slate-200">
                <CardTitle className="text-lg text-[#333333]">Seções</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                {sections.map((section) => {
                  const SectionIcon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant="ghost"
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full justify-start mb-1 ${
                        activeSection === section.id
                          ? 'bg-[#4169E1] text-white hover:bg-[#3151c7] hover:text-white'
                          : 'hover:bg-blue-50'
                      }`}
                    >
                      <SectionIcon className="w-4 h-4 mr-2" />
                      {section.title}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-slate-200">
              <CardHeader className="bg-blue-50 border-b-2 border-slate-200">
                <CardTitle className="text-xl text-[#333333] flex items-center gap-2">
                  <Icon className="w-6 h-6 text-[#4169E1]" />
                  {currentSection?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-sm max-w-none">
                  {currentSection?.content.split('\n').map((line, i) => {
                    // Títulos H1
                    if (line.startsWith('# ')) {
                      return (
                        <h1 key={i} className="text-2xl font-bold text-[#333333] mb-4 mt-6 flex items-center gap-2">
                          {line.substring(2)}
                        </h1>
                      );
                    }
                    // Títulos H2
                    if (line.startsWith('## ')) {
                      return (
                        <h2 key={i} className="text-xl font-bold text-[#4169E1] mb-3 mt-5">
                          {line.substring(3)}
                        </h2>
                      );
                    }
                    // Títulos H3
                    if (line.startsWith('### ')) {
                      return (
                        <h3 key={i} className="text-lg font-bold text-[#333333] mb-2 mt-4">
                          {line.substring(4)}
                        </h3>
                      );
                    }
                    // Lista
                    if (line.startsWith('- ')) {
                      return (
                        <div key={i} className="flex items-start gap-2 ml-4 my-1">
                          <span className="text-[#4169E1] mt-1">•</span>
                          <span className="text-[#333333]">{line.substring(2)}</span>
                        </div>
                      );
                    }
                    // Código inline
                    if (line.includes('```')) {
                      return null; // Skip code blocks for now
                    }
                    // Negrito
                    if (line.includes('**')) {
                      const parts = line.split('**');
                      return (
                        <p key={i} className="text-[#333333] my-2">
                          {parts.map((part, j) =>
                            j % 2 === 1 ? <strong key={j} className="font-bold text-[#4169E1]">{part}</strong> : part
                          )}
                        </p>
                      );
                    }
                    // Parágrafo normal
                    if (line.trim()) {
                      return <p key={i} className="text-[#333333] my-2">{line}</p>;
                    }
                    return <br key={i} />;
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Color Palette Visual */}
            {activeSection === 'design' && (
              <Card className="border-2 border-slate-200 mt-6">
                <CardHeader className="bg-blue-50 border-b-2 border-slate-200">
                  <CardTitle className="text-lg text-[#333333]">Paleta Visual</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-full h-20 bg-[#4169E1] rounded-lg mb-2 shadow-lg"></div>
                      <p className="text-xs font-bold text-[#333333]">Azul Royal</p>
                      <p className="text-xs text-[#AAAAAA]">#4169E1</p>
                      <p className="text-xs text-[#4169E1] font-bold mt-1">30%</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-20 bg-[#FFC107] rounded-lg mb-2 shadow-lg"></div>
                      <p className="text-xs font-bold text-[#333333]">Dourado</p>
                      <p className="text-xs text-[#AAAAAA]">#FFC107</p>
                      <p className="text-xs text-[#FFC107] font-bold mt-1">10%</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-20 bg-[#28A745] rounded-lg mb-2 shadow-lg"></div>
                      <p className="text-xs font-bold text-[#333333]">Verde</p>
                      <p className="text-xs text-[#AAAAAA]">#28A745</p>
                      <p className="text-xs text-[#28A745] font-bold mt-1">5%</p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-20 bg-white border-2 border-slate-200 rounded-lg mb-2"></div>
                      <p className="text-xs font-bold text-[#333333]">Branco</p>
                      <p className="text-xs text-[#AAAAAA]">#FFFFFF</p>
                      <p className="text-xs text-[#333333] font-bold mt-1">60%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}