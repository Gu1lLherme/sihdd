import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, User, Users, Home, Calculator, Scale, AlertTriangle, Heart, FileText } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#f59e0b', '#10b981'];

const REGIME_LABELS = {
  uniao_estavel: "União Estável",
  comunhao_universal: "Comunhão Universal",
  comunhao_parcial: "Comunhão Parcial",
  separacao_total: "Separação Total",
  separacao_obrigatoria: "Separação Obrigatória",
  participacao_final: "Participação Final"
};

export default function Resumo({ formData, isCalculating, resultadoPartilha }) {
  const itcmdTotal = resultadoPartilha?.resumo?.itcmd_total || formData.valor_itcmd || 0;
  const meacaoConjuge = resultadoPartilha?.resumo?.meacao_conjuge || formData.valor_meacao_conjuge || 0;
  const herancaConjuge = resultadoPartilha?.resumo?.heranca_conjuge || formData.valor_heranca_conjuge || 0;
  const herancaFilhos = resultadoPartilha?.resumo?.heranca_filhos || formData.valor_heranca_filhos || 0;
  const regra25Aplicada = resultadoPartilha?.resumo?.regra_25_aplicada || false;

  // Dados para o gráfico de distribuição
  const chartData = [];
  
  if (meacaoConjuge > 0) {
    chartData.push({
      name: `Meação Cônjuge`,
      value: meacaoConjuge,
      tipo: 'meacao'
    });
  }
  
  if (herancaConjuge > 0) {
    chartData.push({
      name: `Herança Cônjuge`,
      value: herancaConjuge,
      tipo: 'heranca_conjuge'
    });
  }
  
  const herdeirosFilhos = resultadoPartilha?.herdeiros?.filter(h => 
    ['filho', 'filha', 'neto', 'neta'].includes(h.parentesco)
  ) || formData.herdeiros.filter(h => ['filho', 'filha', 'neto', 'neta'].includes(h.parentesco));
  
  herdeirosFilhos.forEach(h => {
    const valor = h.valor_parte || (formData.valor_patrimonio * (h.percentual_partilha || 0)) / 100;
    if (valor > 0) {
      chartData.push({
        name: h.nome,
        value: valor,
        tipo: 'filho'
      });
    }
  });

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-blue-900 pl-4 mb-6">
        <h3 className="font-semibold text-lg text-blue-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Resumo do Inventário
        </h3>
        <p className="text-sm text-slate-600">Revise todos os dados antes de salvar</p>
      </div>

      {/* Aviso sobre Declaração SEFAZ */}
      <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-start gap-3">
        <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900">Declaração SEFAZ</p>
          <p className="text-sm text-blue-700">
            Após salvar o caso, você poderá gerar a "Declaração do ITCMD Causa Mortis" para envio à SEFAZ na página de detalhes do caso.
          </p>
        </div>
      </div>

      {/* Alerta da Regra dos 25% */}
      {regra25Aplicada && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">Regra dos 25% Aplicada</p>
            <p className="text-sm text-amber-700">
              O cônjuge sobrevivente, como ascendente de todos os herdeiros, teve sua parte ajustada para garantir o mínimo de 25% da herança.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dados Básicos */}
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-900" />
              Dados Básicos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Falecido:</span>
              <span className="font-semibold">{formData.nome_falecido || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">CPF:</span>
              <span className="font-semibold">{formData.cpf_falecido || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Data Óbito:</span>
              <span className="font-semibold">{formData.data_obito || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Cônjuge:</span>
              <span className="font-semibold">{formData.conjuge_nome || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Regime de Bens:</span>
              <Badge variant="outline" className="font-semibold">
                {REGIME_LABELS[formData.regime_bens] || formData.regime_bens || "-"}
              </Badge>
            </div>
            {formData.data_casamento && (
              <div className="flex justify-between">
                <span className="text-slate-600">Data Casamento:</span>
                <span className="font-semibold">{formData.data_casamento}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t">
              <span className="text-slate-600">Patrimônio Total:</span>
              <span className="font-semibold text-green-600">
                R$ {(formData.valor_patrimonio || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Cálculo do ITCMD */}
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-900" />
              Cálculo do ITCMD
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Alíquota:</span>
              <span className="font-semibold">{formData.aliquota || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Base de Cálculo (Herança):</span>
              <span className="font-semibold">
                R$ {(herancaConjuge + herancaFilhos).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="text-slate-900 font-semibold">ITCMD Total:</span>
              <span className="font-bold text-lg text-blue-900">
                {isCalculating ? "Calculando..." : `R$ ${itcmdTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              * ITCMD incide apenas sobre herança, não sobre meação
            </p>
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

      {/* Herdeiros */}
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-900" />
            Herdeiros ({formData.herdeiros.length})
          </CardTitle>
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
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="capitalize text-xs">
                          {herdeiro.parentesco}
                        </Badge>
                        {herdeiro.e_filho_conjuge === false && (
                          <Badge variant="secondary" className="text-xs">Enteado</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-900">{percentual.toFixed(2)}%</p>
                      <p className="text-sm text-slate-600">
                        R$ {valorParte.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      {itcmdHerdeiro > 0 && (
                        <p className="text-xs text-red-600">
                          ITCMD: R$ {itcmdHerdeiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Total para filhos */}
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

      {/* Gráfico de Distribuição */}
      {chartData.length > 0 && (
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-lg flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-900" />
              Distribuição da Partilha
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.tipo === 'meacao' ? '#f59e0b' : entry.tipo === 'heranca_conjuge' ? '#10b981' : COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Bens */}
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="text-lg flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-900" />
            Bens ({formData.bens.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {formData.bens.length === 0 ? (
            <p className="text-slate-500 text-center py-4">Nenhum bem cadastrado</p>
          ) : (
            <div className="space-y-3">
              {(resultadoPartilha?.bens || formData.bens).map((bem, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold">{bem.descricao}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="capitalize text-xs">
                          {(bem.tipo || '').replace('_', ' ')}
                        </Badge>
                        <Badge 
                          variant={bem.tipo_bem_partilha === 'comum' || bem.tipo_partilha === 'comum' ? 'default' : 'secondary'} 
                          className="text-xs"
                        >
                          {bem.tipo_bem_partilha || bem.tipo_partilha || 'Não classificado'}
                        </Badge>
                      </div>
                      {bem.data_aquisicao && (
                        <p className="text-xs text-slate-500 mt-1">Adquirido em: {bem.data_aquisicao}</p>
                      )}
                    </div>
                    <p className="font-semibold text-green-600">
                      R$ {(bem.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  
                  {/* Detalhes da partilha do bem */}
                  {(bem.valor_meacao_conjuge || bem.meacao_conjuge || bem.valor_heranca_conjuge || bem.heranca_conjuge) && (
                    <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Meação:</span>
                        <p className="font-medium text-amber-600">
                          R$ {(bem.valor_meacao_conjuge || bem.meacao_conjuge || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">Her. Cônjuge:</span>
                        <p className="font-medium text-blue-600">
                          R$ {(bem.valor_heranca_conjuge || bem.heranca_conjuge || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">Her. Filhos:</span>
                        <p className="font-medium text-green-600">
                          R$ {(bem.valor_heranca_filhos || bem.heranca_filhos || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}