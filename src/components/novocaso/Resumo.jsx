import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calculator, Scale, AlertTriangle, Heart, FileText } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

import RevisaoDadosBasicos from "./resumo/RevisaoDadosBasicos";
import RevisaoConjuge from "./resumo/RevisaoConjuge";
import RevisaoInventario from "./resumo/RevisaoInventario";
import RevisaoAdministrador from "./resumo/RevisaoAdministrador";
import RevisaoHerdeiros from "./resumo/RevisaoHerdeiros";
import RevisaoInventariante from "./resumo/RevisaoInventariante";
import RevisaoBens from "./resumo/RevisaoBens";
import RevisaoDividas from "./resumo/RevisaoDividas";
import CenarioBensIndicator from "./CenarioBensIndicator";
import PilaresITCMD from "./PilaresITCMD";

const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#f59e0b', '#10b981'];

export default function Resumo({ formData, setFormData, isCalculating, resultadoPartilha }) {
  const itcmdTotal = resultadoPartilha?.resumo?.itcmd_total || formData.valor_itcmd || 0;
  const meacaoConjuge = resultadoPartilha?.resumo?.meacao_conjuge || formData.valor_meacao_conjuge || 0;
  const herancaConjuge = resultadoPartilha?.resumo?.heranca_conjuge || formData.valor_heranca_conjuge || 0;
  const herancaFilhos = resultadoPartilha?.resumo?.heranca_filhos || formData.valor_heranca_filhos || 0;
  const regra25Aplicada = resultadoPartilha?.resumo?.regra_25_aplicada || false;

  // Gráfico de distribuição
  const chartData = [];
  if (meacaoConjuge > 0) chartData.push({ name: 'Meação Cônjuge', value: meacaoConjuge, tipo: 'meacao' });
  if (herancaConjuge > 0) chartData.push({ name: 'Herança Cônjuge', value: herancaConjuge, tipo: 'heranca_conjuge' });

  const herdeirosFilhos = resultadoPartilha?.herdeiros?.filter(h =>
    ['filho', 'filha', 'neto', 'neta'].includes(h.parentesco)
  ) || formData.herdeiros.filter(h => ['filho', 'filha', 'neto', 'neta'].includes(h.parentesco));

  herdeirosFilhos.forEach(h => {
    const valor = h.valor_parte || (formData.valor_patrimonio * (h.percentual_partilha || 0)) / 100;
    if (valor > 0) chartData.push({ name: h.nome, value: valor, tipo: 'filho' });
  });

  // Navegar para etapa específica via setFormData proxy
  const handleNavigate = (etapa) => {
    // Dispara evento customizado para que NovoCaso capture e mude a etapa
    window.dispatchEvent(new CustomEvent('resumo-navigate', { detail: { etapa } }));
  };

  const totalBens = formData.bens.reduce((s, b) => s + (Number(b.valor) || 0), 0);
  const totalDividas = (formData.dividas || []).reduce((s, d) => s + (Number(d.valor) || 0), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="border-l-4 border-blue-900 pl-4 mb-2">
        <h3 className="font-semibold text-lg text-blue-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Revisão Final — Pente Fino
        </h3>
        <p className="text-sm text-slate-600">
          Revise todas as informações antes de salvar. Clique em "Editar" para corrigir qualquer etapa.
        </p>
      </div>

      {/* Aviso SEFAZ */}
      <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-start gap-3">
        <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900">Declaração SEFAZ</p>
          <p className="text-sm text-blue-700">
            Após salvar, você poderá gerar a "Declaração do ITCMD Causa Mortis" na página de detalhes do caso.
          </p>
        </div>
      </div>

      {/* Regra dos 25% */}
      {regra25Aplicada && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">Regra dos 25% Aplicada</p>
            <p className="text-sm text-amber-700">
              O cônjuge sobrevivente teve sua parte ajustada para garantir o mínimo de 25% da herança.
            </p>
          </div>
        </div>
      )}

      {/* === REVISÃO DAS 7 ETAPAS === */}
      <RevisaoDadosBasicos formData={formData} onNavigate={handleNavigate} />
      <RevisaoConjuge formData={formData} onNavigate={handleNavigate} />
      <RevisaoInventario formData={formData} onNavigate={handleNavigate} />
      <RevisaoAdministrador formData={formData} onNavigate={handleNavigate} />
      <RevisaoHerdeiros formData={formData} onNavigate={handleNavigate} />
      <RevisaoInventariante formData={formData} onNavigate={handleNavigate} />
      <RevisaoBens formData={formData} onNavigate={handleNavigate} />
      <RevisaoDividas formData={formData} onNavigate={handleNavigate} />

      {/* === DEMONSTRATIVO FINANCEIRO === */}
      <div className="border-l-4 border-emerald-600 pl-4 mt-8 mb-2">
        <h3 className="font-semibold text-lg text-emerald-800">Demonstrativo Financeiro</h3>
      </div>

      {/* Regra de Ouro — Art. 1.829, I, CC/02 */}
      <CenarioBensIndicator formData={formData} />

      {/* 3 Pilares do SIHDD: Dados + Legislação = Resultado */}
      <PilaresITCMD formData={formData} resultadoPartilha={resultadoPartilha} />

      {/* Resumo Rápido */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Patrimônio</p>
            <p className="text-lg font-bold text-emerald-600">R$ {totalBens.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Dívidas</p>
            <p className="text-lg font-bold text-red-600">R$ {totalDividas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Monte Mor Líquido</p>
            <p className="text-lg font-bold text-amber-600">R$ {(totalBens - totalDividas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">ITCMD ({formData.aliquota || 0}%)</p>
            <p className="text-lg font-bold text-blue-700">
              {isCalculating ? "..." : `R$ ${itcmdTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">sobre base líquida</p>
          </CardContent>
        </Card>
      </div>

      {/* Partilha do Cônjuge */}
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader className="border-b border-amber-200">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-amber-600" />
            Parte do Cônjuge Sobrevivente
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <p className="text-sm text-slate-600 mb-1">Meação</p>
              <p className="text-2xl font-bold text-amber-600">
                R$ {meacaoConjuge.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-500 mt-1">Já é do cônjuge por direito</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <p className="text-sm text-slate-600 mb-1">Herança</p>
              <p className="text-2xl font-bold text-blue-600">
                R$ {herancaConjuge.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-500 mt-1">Recebe do falecido</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <p className="text-sm text-slate-600 mb-1">Total Cônjuge</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {(meacaoConjuge + herancaConjuge).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-500 mt-1">Meação + Herança</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partilha dos Herdeiros */}
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-lg">Partilha dos Herdeiros</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {formData.herdeiros.length === 0 ? (
            <p className="text-slate-500 text-center py-4">Nenhum herdeiro cadastrado</p>
          ) : (
            <div className="space-y-3">
              {(resultadoPartilha?.herdeiros || formData.herdeiros).map((herdeiro, index) => {
                const valorParte = herdeiro.valor_parte || (formData.valor_patrimonio * (herdeiro.percentual_partilha || 0)) / 100;
                const itcmdHerdeiro = herdeiro.valor_itcmd || herdeiro.itcmd || 0;
                const percentual = herdeiro.percentual_partilha || herdeiro.percentual || 0;
                return (
                  <div key={index} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <p className="font-semibold">{herdeiro.nome}</p>
                      <Badge variant="outline" className="capitalize text-xs mt-1">{herdeiro.parentesco}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-900">{percentual.toFixed(2)}%</p>
                      <p className="text-sm text-slate-600">R$ {valorParte.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      {itcmdHerdeiro > 0 && (
                        <p className="text-xs text-red-600">ITCMD: R$ {itcmdHerdeiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-900">Total Herança Filhos:</span>
              <span className="text-xl font-bold text-blue-600">
                R$ {herancaFilhos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico - Pizza se ≤5 membros, Barras se >5 */}
      {chartData.length > 0 && (
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-900" />
              Distribuição da Partilha
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={320}>
              {chartData.length <= 5 ? (
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={100} fill="#8884d8" dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`}
                        fill={entry.tipo === 'meacao' ? '#f59e0b' : entry.tipo === 'heranca_conjuge' ? '#10b981' : COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <Legend />
                </PieChart>
              ) : (
                <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30, top: 5, bottom: 5 }}>
                  <XAxis type="number" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`}
                        fill={entry.tipo === 'meacao' ? '#f59e0b' : entry.tipo === 'heranca_conjuge' ? '#10b981' : COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}