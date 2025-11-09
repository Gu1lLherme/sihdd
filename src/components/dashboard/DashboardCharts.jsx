import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, Activity } from "lucide-react";

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function DashboardCharts({ casos }) {
  // Dados para gráfico de casos por mês (últimos 6 meses)
  const casosPorMes = React.useMemo(() => {
    const hoje = new Date();
    const meses = [];
    
    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesAno = data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      
      const casosDoMes = casos.filter(c => {
        const dataCriacao = new Date(c.created_date);
        return dataCriacao.getMonth() === data.getMonth() && 
               dataCriacao.getFullYear() === data.getFullYear();
      });

      meses.push({
        mes: mesAno,
        casos: casosDoMes.length,
        itcmd: casosDoMes.reduce((sum, c) => sum + (c.valor_itcmd || 0), 0)
      });
    }
    
    return meses;
  }, [casos]);

  // Dados para gráfico de status
  const casosPorStatus = React.useMemo(() => {
    const statusMap = {};
    casos.forEach(c => {
      const status = c.status || 'coleta_dados';
      statusMap[status] = (statusMap[status] || 0) + 1;
    });

    const statusLabels = {
      'coleta_dados': 'Coleta de Dados',
      'calculo_itcmd': 'Cálculo ITCMD',
      'geracao_dae': 'Geração DAE',
      'aguardando_pagamento': 'Aguardando Pagamento',
      'em_analise_sefaz': 'Análise SEFAZ',
      'certidao_emitida': 'Certidão Emitida',
      'finalizado': 'Finalizado'
    };

    return Object.entries(statusMap).map(([status, value]) => ({
      name: statusLabels[status] || status,
      value
    }));
  }, [casos]);

  // Patrimônio total por mês
  const patrimonioTotal = casos.reduce((sum, c) => sum + (c.valor_patrimonio || 0), 0);
  const itcmdTotal = casos.reduce((sum, c) => sum + (c.valor_itcmd || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Casos por Mês */}
      <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            Evolução de Casos (6 meses)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={casosPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="mes" stroke="#64748B" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFF', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }} 
              />
              <Bar dataKey="casos" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Status */}
      <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-purple-600" />
            </div>
            Distribuição por Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={casosPorStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {casosPorStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFF', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de ITCMD por Mês */}
      <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-2">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            ITCMD Arrecadado (6 meses)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={casosPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="mes" stroke="#64748B" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFF', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
              />
              <Line 
                type="monotone" 
                dataKey="itcmd" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}