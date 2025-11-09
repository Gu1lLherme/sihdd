import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, User, Users, Home, Calculator } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

export default function Resumo({ formData }) {
  const itcmdTotal = (formData.valor_patrimonio * formData.aliquota) / 100;
  
  const chartData = formData.herdeiros.map((h, index) => {
    const valorParte = (formData.valor_patrimonio * h.percentual_partilha) / 100;
    return {
      name: h.nome,
      value: valorParte,
      percentual: h.percentual_partilha,
    };
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="flex justify-between pt-2 border-t">
              <span className="text-slate-600">Patrimônio Total:</span>
              <span className="font-semibold text-green-600">
                R$ {formData.valor_patrimonio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>

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
              <span className="font-semibold">{formData.aliquota}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Base de Cálculo:</span>
              <span className="font-semibold">
                R$ {formData.valor_patrimonio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="text-slate-900 font-semibold">ITCMD Total:</span>
              <span className="font-bold text-lg text-blue-900">
                R$ {itcmdTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

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
              {formData.herdeiros.map((herdeiro, index) => {
                const valorParte = (formData.valor_patrimonio * herdeiro.percentual_partilha) / 100;
                return (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{herdeiro.nome}</p>
                      <p className="text-sm text-slate-600 capitalize">{herdeiro.parentesco}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-900">{herdeiro.percentual_partilha}%</p>
                      <p className="text-sm text-slate-600">
                        R$ {valorParte.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {formData.herdeiros.length > 0 && (
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-lg">Distribuição da Partilha</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentual }) => `${percentual}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            <div className="space-y-2">
              {formData.bens.map((bem, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{bem.descricao}</p>
                    <p className="text-sm text-slate-600 capitalize">{bem.tipo.replace('_', ' ')}</p>
                  </div>
                  <p className="font-semibold text-green-600">
                    R$ {bem.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}